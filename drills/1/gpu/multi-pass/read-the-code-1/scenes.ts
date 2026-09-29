// Scenes for the multi-pass and post-processing page. The README places each one with <div data-scene="name">.
// Both scenes draw each frame themselves, through an EffectComposer (see drawYourself in lesson.ts).
import { choiceButtons, COLORS, drawYourself, overlay, sunlight } from '@harness/lesson';
import type { Harness, SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { FXAAPass } from 'three/addons/postprocessing/FXAAPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// A kiosk with a glowing screen (bright enough to bloom) and a stool beside it.
function buildKiosk(world: THREE.Scene) {
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.6, 0.5), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  body.position.set(-0.3, 0.85, 0);
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.7, 0.5),
    new THREE.MeshStandardMaterial({ color: '#000000', emissive: '#bfe3ff', emissiveIntensity: 2 }),
  );
  screen.position.set(0, 0.3, 0.26);
  body.add(screen);
  const stool = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.6, 32), new THREE.MeshStandardMaterial({ color: COLORS.orange }));
  stool.position.set(0.8, 0.35, 0.3);
  world.add(body, stool);
  return { body, stool };
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

function setUp(harness: Harness) {
  const { camera, controls, renderer } = harness;
  camera.position.set(1.3, 1.5, 3);
  controls.target.set(0.1, 0.85, 0);
  const world = drawYourself(harness);
  const axes = world.children.find((child) => child instanceof THREE.AxesHelper);
  if (axes) axes.visible = false;
  sunlight(world, new THREE.Vector3(2, 4, 3), 0.8, 2.5);
  const size = renderer.getSize(new THREE.Vector2());
  return { world, size };
}

export const chain: SceneSetup = (harness) => {
  const { camera, container, renderer, onFrame } = harness;
  const { world, size } = setUp(harness);
  const { body } = buildKiosk(world);

  const composer = new EffectComposer(renderer);
  const passes = {
    render: new RenderPass(world, camera),
    bloom: new UnrealBloomPass(size.clone(), 0.6, 0.4, 0.85),
    outline: new OutlinePass(size.clone(), world, camera, [body]),
    output: new OutputPass(),
    fxaa: new FXAAPass(),
  };
  passes.outline.visibleEdgeColor.set(COLORS.yellow);
  for (const pass of Object.values(passes)) composer.addPass(pass);
  const resize = followCanvas(renderer, composer);

  const presets = [
    { html: 'no effects', on: [] as string[] },
    { html: '+ bloom', on: ['bloom'] },
    { html: '+ bloom + outline', on: ['bloom', 'outline'] },
    { html: '+ bloom + outline + FXAA', on: ['bloom', 'outline', 'fxaa'] },
  ];
  choiceButtons(
    overlay(container, 'controls'),
    presets.map((preset) => ({
      html: preset.html,
      select: () => {
        passes.bloom.enabled = preset.on.includes('bloom');
        passes.outline.enabled = preset.on.includes('outline');
        passes.fxaa.enabled = preset.on.includes('fxaa');
      },
    })),
  );

  // Counts what the composer draws: renders of a Scene, and full-screen passes (a single mesh).
  const counts = { scenes: 0, fullScreen: 0 };
  const render = renderer.render.bind(renderer);
  let counting = false;
  renderer.render = (scene, cam) => {
    if (counting) counts[scene instanceof THREE.Scene ? 'scenes' : 'fullScreen'] += 1;
    render(scene, cam);
  };
  renderer.info.autoReset = false; // the composer calls render() many times a frame

  const readout = overlay(container, 'readout');
  const device = new THREE.Vector2();
  const names = new Map<object, string>([
    [passes.render, 'RenderPass'],
    [passes.bloom, 'UnrealBloomPass'],
    [passes.outline, 'OutlinePass'],
    [passes.output, 'OutputPass'],
    [passes.fxaa, 'FXAAPass'],
  ]);
  onFrame((_, elapsed) => {
    resize();
    body.rotation.y = Math.sin(elapsed * 0.5) * 0.4;
    counts.scenes = counts.fullScreen = 0;
    renderer.info.reset();
    counting = true;
    composer.render();
    counting = false;
    const calls = renderer.info.render.calls;
    renderer.getDrawingBufferSize(device);
    const chainNames = composer.passes.filter((pass) => pass.enabled).map((pass) => names.get(pass));
    readout.textContent = [
      chainNames.join(' → '),
      `last frame: ${counts.scenes} scene render${counts.scenes === 1 ? '' : 's'} and ${counts.fullScreen} full-screen pass${counts.fullScreen === 1 ? '' : 'es'}, ${calls} draw calls in all`,
      `one full-screen pass at this canvas: ${device.x} × ${device.y} = ${(device.x * device.y).toLocaleString('en-US')} pixels of fragment work`,
    ].join('\n');
  });
};

export const output: SceneSetup = (harness) => {
  const { camera, container, renderer, onFrame } = harness;
  const { world } = setUp(harness);
  buildKiosk(world);
  renderer.toneMapping = THREE.NeutralToneMapping;

  const withoutOutput = new EffectComposer(renderer);
  withoutOutput.addPass(new RenderPass(world, camera));
  withoutOutput.addPass(new FXAAPass());
  const withOutput = new EffectComposer(renderer);
  withOutput.addPass(new RenderPass(world, camera));
  withOutput.addPass(new OutputPass());
  withOutput.addPass(new FXAAPass());
  const resizers = [followCanvas(renderer, withoutOutput), followCanvas(renderer, withOutput)];

  const modes = [
    {
      html: '<code>renderer.render</code>',
      lines: ['renderer.render(scene, camera)   // no composer', 'tone mapped and converted to sRGB as each material draws to the canvas'],
      draw: () => renderer.render(world, camera),
    },
    {
      html: 'composer, no OutputPass',
      lines: ['RenderPass → FXAAPass', 'the picture reaches the canvas as it left the render target: linear, and not tone mapped'],
      draw: () => withoutOutput.render(),
    },
    {
      html: 'composer + OutputPass',
      lines: ['RenderPass → OutputPass → FXAAPass', 'OutputPass applies the tone mapping and the sRGB conversion, as the canvas would'],
      draw: () => withOutput.render(),
    },
  ];
  let mode = modes[0];
  choiceButtons(
    overlay(container, 'controls'),
    modes.map((item) => ({ html: item.html, select: () => (mode = item) })),
  );

  const readout = overlay(container, 'readout');
  onFrame(() => {
    for (const resize of resizers) resize();
    mode.draw();
    readout.textContent = [...mode.lines, 'renderer.toneMapping = NeutralToneMapping'].join('\n');
  });
};
