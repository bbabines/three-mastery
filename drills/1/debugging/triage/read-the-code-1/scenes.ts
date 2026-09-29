// Scenes for the triage page. The README places each one with <div data-scene="name">.
// Both scenes draw each frame themselves (see drawYourself in lesson.ts): the black screen scene so
// it can switch to a composer, the wrong color scene so it can read a pixel right after drawing.
import { buttonGroup, choiceButtons, COLORS, drawYourself, formatNumber, formatVector, overlay, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// A flat panel built by hand, facing +Z. With `reversed`, each triangle's corners are listed the
// other way round, so its front faces away from the camera.
function panelGeometry(reversed: boolean) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute([-1, -0.6, 0, 1, -0.6, 0, 1, 0.6, 0, -1, 0.6, 0], 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1], 3));
  geometry.setIndex(reversed ? [0, 2, 1, 0, 3, 2] : [0, 1, 2, 0, 2, 3]);
  return geometry;
}

// Hides the harness's floor grid and axes, which would still show on a black screen.
function hideFloorHelpers(world: THREE.Scene) {
  for (const child of world.children) {
    if (child instanceof THREE.GridHelper || child instanceof THREE.AxesHelper) child.visible = false;
  }
}

// Keeps a composer the same size as the canvas, since it doesn't follow the renderer by itself.
function followCanvas(renderer: THREE.WebGLRenderer, composer: EffectComposer) {
  const size = new THREE.Vector2();
  const last = new THREE.Vector2();
  return () => {
    renderer.getSize(size);
    if (!size.equals(last)) {
      last.copy(size);
      composer.setSize(size.x, size.y);
    }
  };
}

interface Bug {
  html: string;
  bucket: string;
  line: string;
  apply(): void;
  check: string;
  runCheck(): void;
  result(): string;
}

export const blackScreen: SceneSetup = (harness) => {
  const { camera, controls, container, renderer, onFrame } = harness;
  camera.position.set(0, 1.3, 4.2);
  controls.target.set(0, 1.1, 0);
  const world = drawYourself(harness);
  world.background = new THREE.Color(0x000000);
  hideFloorHelpers(world);
  const sun = sunlight(world, new THREE.Vector3(1, 2, 4), 0.8, 2.5);
  const sky = world.children.find((child): child is THREE.HemisphereLight => child instanceof THREE.HemisphereLight)!;

  const front = panelGeometry(false);
  const back = panelGeometry(true);
  const lit = new THREE.MeshStandardMaterial({ color: COLORS.orange });
  const unlit = new THREE.MeshBasicMaterial({ color: COLORS.orange });
  const panel = new THREE.Mesh<THREE.BufferGeometry, THREE.Material>(front, lit);
  panel.position.set(0, 1.1, 0);
  world.add(panel);

  // Post-processing with the RenderPass left out: nothing ever draws the scene into it.
  const composer = new EffectComposer(renderer);
  composer.addPass(new OutputPass());
  const resize = followCanvas(renderer, composer);

  const size = new THREE.Vector3();
  const spot = new THREE.Vector3();
  let useComposer = false;

  const reset = () => {
    panel.scale.setScalar(1);
    panel.geometry = front;
    panel.material = lit;
    lit.side = THREE.FrontSide;
    lit.needsUpdate = true; // a side change only relights correctly after a rebuild
    sky.intensity = 0.8;
    sun.intensity = 2.5;
    camera.near = 0.1;
    camera.updateProjectionMatrix();
    useComposer = false;
  };

  const bugs: Bug[] = [
    {
      html: 'transform',
      bucket: 'transform',
      line: 'panel.scale.setScalar(0.001)   // mm to meters, done twice',
      apply: () => panel.scale.setScalar(0.001),
      check: 'new Box3().setFromObject(panel).getSize(v)',
      runCheck: () => {},
      result: () => `${formatVector(new THREE.Box3().setFromObject(panel).getSize(size), 3)}: it's there, but a speck`,
    },
    {
      html: 'geometry',
      bucket: 'geometry',
      line: "panel.geometry.setIndex([0, 2, 1, 0, 3, 2])   // corners listed clockwise",
      apply: () => (panel.geometry = back),
      check: 'panel.material.side = DoubleSide',
      runCheck: () => {
        lit.side = THREE.DoubleSide;
        lit.needsUpdate = true;
      },
      result: () => 'it appears: its triangles face away from the camera',
    },
    {
      html: 'material',
      bucket: 'material',
      line: 'new MeshStandardMaterial({ color })   // and no light in the scene',
      apply: () => (sky.intensity = sun.intensity = 0),
      check: "panel.material = new MeshBasicMaterial({ color: 'orange' })",
      runCheck: () => (panel.material = unlit),
      result: () => 'it appears: a lit material with no light is drawn black',
    },
    {
      html: 'camera',
      bucket: 'camera',
      line: 'camera.near = 10   // meant as 10 cm',
      apply: () => {
        camera.near = 10;
        camera.updateProjectionMatrix();
      },
      check: 'console.log(camera.near, camera.position.distanceTo(panelSpot))',
      runCheck: () => {},
      result: () =>
        `near ${formatNumber(camera.near)}, distance ${formatNumber(camera.position.distanceTo(panel.getWorldPosition(spot)), 1)}: ` +
        'closer than near, so it’s cut away',
    },
    {
      html: 'pipeline',
      bucket: 'pipeline',
      line: 'composer.addPass(new OutputPass())   // no RenderPass before it',
      apply: () => (useComposer = true),
      check: 'renderer.render(scene, camera)   // in place of composer.render()',
      runCheck: () => (useComposer = false),
      result: () => 'it appears: the composer never drew the scene',
    },
  ];

  let bug = bugs[0];
  let checking = false;
  const apply = () => {
    reset();
    bug.apply();
    if (checking) bug.runCheck();
  };

  const bar = overlay(container, 'controls');
  choiceButtons(
    buttonGroup(bar, 'Bug:'),
    bugs.map((item) => ({ html: item.html, select: () => ((bug = item), apply()) })),
  );
  choiceButtons(buttonGroup(bar), [
    { html: 'as reported', select: () => ((checking = false), apply()) },
    { html: 'run the first check', select: () => ((checking = true), apply()) },
  ]);

  const readout = overlay(container, 'readout');
  onFrame(() => {
    resize();
    if (useComposer) {
      // The composer's buffer was never drawn into. An empty render target reads as transparent,
      // which some browsers show as the page behind the canvas; clear it to opaque black, the way
      // an empty picture looks on most setups.
      renderer.setRenderTarget(composer.readBuffer);
      renderer.setClearColor(0x000000, 1);
      renderer.clear();
      renderer.setRenderTarget(null); // the composer puts back whatever target was set before it
      composer.render();
    } else {
      renderer.render(world, camera);
    }
    readout.textContent = [
      `bug     ${bug.line}`,
      `bucket  ${bug.bucket}`,
      `check   ${checking ? bug.check : 'none yet'}`,
      `        → ${checking ? bug.result() : 'a black screen, and a clean console'}`,
    ].join('\n');
  });
};

const BRAND = '#f97316';
const BRAND_BYTES = [0xf9, 0x73, 0x16]; // the swatch's red, green, and blue, as the screen shows them
const hex = (pixel: Uint8Array) => `#${[pixel[0], pixel[1], pixel[2]].map((n) => n.toString(16).padStart(2, '0')).join('')}`;

export const wrongColor: SceneSetup = (harness) => {
  const { camera, controls, container, renderer, onFrame } = harness;
  camera.position.set(0.9, 1.5, 3.2);
  controls.target.set(0, 1, 0);
  const world = drawYourself(harness);
  const axes = world.children.find((child) => child instanceof THREE.AxesHelper);
  if (axes) axes.visible = false;
  sunlight(world, new THREE.Vector3(2, 4, 5), 0.8, 2);

  const lit = new THREE.MeshStandardMaterial({ color: BRAND, roughness: 0.6 });
  const basic = new THREE.MeshBasicMaterial({ color: BRAND });
  const part = new THREE.Mesh<THREE.BufferGeometry, THREE.Material>(new THREE.BoxGeometry(1.6, 1, 0.4), lit);
  part.position.set(0, 1, 0);
  world.add(part);

  // The brand swatch, as CSS draws it, in the top-right corner.
  const swatch = document.createElement('div');
  swatch.style.cssText =
    'position: absolute; top: 10px; right: 10px; padding: 6px 10px 6px 34px; border-radius: 6px; ' +
    'background: rgba(21, 23, 28, 0.85); font: 12px ui-monospace, monospace; color: #d8dbe2;';
  swatch.innerHTML = `<span style="position: absolute; left: 8px; top: 6px; width: 18px; height: 16px; border-radius: 3px; background: ${BRAND};"></span>brand ${BRAND}`;
  container.append(swatch);

  const bugs = [
    { html: 'as designed', line: '// no bug: the reference', apply: () => {} },
    { html: 'metalness = 1', line: 'part.material.metalness = 1', apply: () => (lit.metalness = 1) },
    {
      html: 'linear output',
      line: 'renderer.outputColorSpace = LinearSRGBColorSpace',
      apply: () => (renderer.outputColorSpace = THREE.LinearSRGBColorSpace),
    },
    { html: 'AgX tone mapping', line: 'renderer.toneMapping = AgXToneMapping', apply: () => (renderer.toneMapping = THREE.AgXToneMapping) },
  ];
  let bug = bugs[0];
  let checking = false;
  const apply = () => {
    lit.metalness = 0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    bug.apply();
    part.material = checking ? basic : lit;
  };

  const bar = overlay(container, 'controls');
  choiceButtons(
    buttonGroup(bar, 'Bug:'),
    bugs.map((item) => ({ html: item.html, select: () => ((bug = item), apply()) })),
  );
  choiceButtons(buttonGroup(bar), [
    { html: 'as reported', select: () => ((checking = false), apply()) },
    { html: 'check: <code>MeshBasicMaterial</code>', select: () => ((checking = true), apply()) },
  ]);

  const readout = overlay(container, 'readout');
  const gl = renderer.getContext();
  const buffer = new THREE.Vector2();
  const pixel = new Uint8Array(4);
  let frame = 0;
  onFrame(() => {
    renderer.render(world, camera);
    // Read the pixel at the middle of the canvas right after drawing it, every other frame.
    if (frame++ % 2 === 1) {
      renderer.getDrawingBufferSize(buffer);
      gl.readPixels(Math.floor(buffer.x / 2), Math.floor(buffer.y / 2), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    }
    const matches = BRAND_BYTES.every((byte, i) => Math.abs(pixel[i] - byte) <= 2);
    const verdict = !checking
      ? 'under the lights, so shading changes it: run the check'
      : matches
        ? bug === bugs[0]
          ? 'matches: nothing to fix'
          : 'matches, so the material or its lighting changed it: material'
        : 'still off, so something after the material changed it: pipeline';
    readout.textContent = [
      `bug    ${bug.line}`,
      `check  ${checking ? `part.material = new MeshBasicMaterial({ color: '${BRAND}' })` : 'none yet'}`,
      `pixel  ${hex(pixel)}: ${verdict}`,
    ].join('\n');
  });
};
