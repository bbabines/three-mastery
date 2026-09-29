// Scenes for the multisampling page. The README places each one with <div data-scene="name">.
// The scene draws each frame itself, directly or through a composer (see drawYourself in lesson.ts).
import { choiceButtons, COLORS, drawYourself, formatBytes, overlay, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';

export const edges: SceneSetup = (harness) => {
  const { camera, controls, container, renderer, onFrame } = harness;
  camera.position.set(1.8, 1.75, 2.9);
  controls.target.set(0, 1.05, 0);
  const world = drawYourself(harness);
  sunlight(world, new THREE.Vector3(2, 4, 3), 0.8, 2.5);

  // A rack turned at an angle, so its uprights and shelf edges run diagonally across the screen.
  const rack = new THREE.Group();
  const steel = new THREE.MeshStandardMaterial({ color: COLORS.white });
  for (const x of [-0.6, 0.6]) {
    for (const z of [-0.2, 0.2]) {
      const upright = new THREE.Mesh(new THREE.BoxGeometry(0.03, 1.6, 0.03), steel);
      upright.position.set(x, 0.85, z);
      rack.add(upright);
    }
  }
  for (const y of [0.35, 0.95, 1.55]) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.03, 0.45), new THREE.MeshStandardMaterial({ color: COLORS.orange }));
    shelf.position.y = y;
    rack.add(shelf);
  }
  rack.rotation.set(0, 0.5, 0.12);
  rack.position.y = 0.1; // tilted, its low corner still clears the floor grid
  world.add(rack);
  const axes = world.children.find((child) => child instanceof THREE.AxesHelper);
  if (axes) axes.visible = false; // it would stand inside the rack

  // Cables: one-pixel lines, the worst case for jagged edges.
  const cableMaterial = new THREE.LineBasicMaterial({ color: COLORS.yellow });
  for (let i = 0; i < 4; i++) {
    const cable = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-1.4 + i * 0.12, 1.9, -0.6), new THREE.Vector3(1.2, 0.1 + i * 0.12, 0.8)]),
      cableMaterial,
    );
    world.add(cable);
  }

  const makeComposer = (samples: number) => {
    const size = renderer.getDrawingBufferSize(new THREE.Vector2());
    const target = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType, samples });
    const composer = new EffectComposer(renderer, target);
    composer.addPass(new RenderPass(world, camera));
    composer.addPass(new OutputPass());
    return composer;
  };
  const composers = [makeComposer(0), makeComposer(4)];
  // A composer doesn't follow the canvas's size by itself.
  const css = new THREE.Vector2();
  const lastCss = new THREE.Vector2();
  const device = new THREE.Vector2();

  const modes = [
    { html: 'canvas, <code>antialias: true</code>', samples: -1, code: 'renderer.render(scene, camera)   // the canvas, antialias: true' },
    { html: 'composer, <code>samples: 0</code>', samples: 0, code: 'new EffectComposer(renderer)   // its targets: samples 0, the default' },
    { html: 'composer, <code>samples: 4</code>', samples: 4, code: 'new EffectComposer(renderer, new WebGLRenderTarget(w, h, { type: HalfFloatType, samples: 4 }))' },
  ];
  let mode = modes[0];
  choiceButtons(
    overlay(container, 'controls'),
    modes.map((item) => ({ html: item.html, select: () => (mode = item) })),
  );

  const readout = overlay(container, 'readout');
  onFrame(() => {
    renderer.getSize(css);
    if (!css.equals(lastCss)) {
      lastCss.copy(css);
      for (const composer of composers) composer.setSize(css.x, css.y);
    }
    if (mode.samples < 0) renderer.render(world, camera);
    else composers[mode.samples === 0 ? 0 : 1].render();

    renderer.getDrawingBufferSize(device);
    const pixels = device.x * device.y;
    // Per pixel, per target: half-float color (8 bytes) and depth (about 4 bytes) for every sample,
    // plus, when multisampled, the plain picture the samples are averaged into.
    const perPixel = mode.samples === 4 ? 4 * (8 + 4) + 8 : 8 + 4;
    readout.textContent = [
      mode.code,
      mode.samples === 0
        ? 'jagged edges: one test per pixel, at its center'
        : mode.samples === 4
          ? 'smooth edges: 4 tests per pixel along each edge'
          : 'smooth edges: the browser multisamples the canvas',
      mode.samples < 0
        ? "memory: the canvas's own buffers, which the browser manages"
        : `memory for the composer's two pictures: about ${formatBytes(2 * pixels * perPixel)} at ${device.x} × ${device.y}`,
    ].join('\n');
  });
};
