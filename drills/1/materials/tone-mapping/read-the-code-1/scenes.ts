// Scenes for the tone mapping and exposure page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, formatNumber, label, overlay, screenColor, slider, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const TONE_MAPPINGS: { name: string; value: THREE.ToneMapping }[] = [
  { name: 'NoToneMapping', value: THREE.NoToneMapping },
  { name: 'ACESFilmicToneMapping', value: THREE.ACESFilmicToneMapping },
  { name: 'AgXToneMapping', value: THREE.AgXToneMapping },
  { name: 'NeutralToneMapping', value: THREE.NeutralToneMapping },
];

// Reads back what's on screen: draws the frame once more and reads its pixels straight away, before
// the browser shows it and clears the drawing. `box` is in device pixels from the bottom left.
function readScreen(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera, box: { x: number; y: number; w: number; h: number }) {
  renderer.render(scene, camera);
  const gl = renderer.getContext();
  const pixels = new Uint8Array(box.w * box.h * 4);
  gl.readPixels(box.x, box.y, box.w, box.h, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  return pixels;
}

// Where a point in the world lands on the canvas, in device pixels from the bottom left.
function toDevicePixels(renderer: THREE.WebGLRenderer, camera: THREE.Camera, point: THREE.Vector3) {
  camera.updateMatrixWorld(); // project() reads the camera's matrices, which render() refreshes
  const ndc = point.clone().project(camera);
  const size = renderer.getDrawingBufferSize(new THREE.Vector2());
  return { x: Math.round(((ndc.x + 1) / 2) * size.x), y: Math.round(((ndc.y + 1) / 2) * size.y) };
}

export const highlights: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0, 1.25, 2.3);
  controls.target.set(0, 0.95, 0);
  controls.update(); // aim the camera now: the first readout projects the ball before the first render
  sunlight(scene, new THREE.Vector3(2, 4, 3), 0.6, 9); // a light bright enough to go past white

  const product = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 64, 32),
    new THREE.MeshStandardMaterial({ color: '#e8d9c4', roughness: 0.45 }),
  );
  product.position.set(0, 0.95, 0);
  scene.add(product);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let mapping = TONE_MAPPINGS[0];
  let exposure = 1;
  let measure = true;
  let frames = 0;

  // Counts how much of the ball has clipped to pure white, from the pixels on screen: after each
  // change, and every 30 frames while you orbit.
  onFrame(() => {
    if (!measure && ++frames % 30 !== 0) return;
    measure = false;
    const center = toDevicePixels(renderer, camera, product.position);
    const edge = toDevicePixels(renderer, camera, product.position.clone().add(new THREE.Vector3(0.6, 0, 0)));
    const r = Math.max(1, edge.x - center.x);
    const box = { x: center.x - r, y: center.y - r, w: 2 * r, h: 2 * r };
    const pixels = readScreen(renderer, scene, camera, box);
    let inside = 0;
    let clipped = 0;
    for (let y = 0; y < box.h; y++) {
      for (let x = 0; x < box.w; x++) {
        if ((x - r) ** 2 + (y - r) ** 2 > (r * 0.95) ** 2) continue;
        const i = (y * box.w + x) * 4;
        inside++;
        if (pixels[i] >= 254 && pixels[i + 1] >= 254 && pixels[i + 2] >= 254) clipped++;
      }
    }
    readout.textContent = [
      `renderer.toneMapping = ${mapping.name}`,
      `renderer.toneMappingExposure = ${formatNumber(exposure)}${mapping.value === THREE.NoToneMapping ? '   (does nothing without tone mapping)' : ''}`,
      `the ball, clipped to flat white: ${Math.round((clipped / inside) * 100)}%`,
    ].join('\n');
  });

  const update = () => {
    renderer.toneMapping = mapping.value;
    renderer.toneMappingExposure = exposure;
    measure = true;
  };
  choiceButtons(
    controlsBar,
    TONE_MAPPINGS.map((item) => ({
      html: item.name.replace('ToneMapping', ''),
      select: () => {
        mapping = item;
        update();
      },
    })),
  );
  slider(controlsBar, 'exposure', { min: 0.25, max: 2.5, step: 0.25, value: exposure }, (value) => {
    exposure = value;
    update();
  });
};

const BRAND = ['#e4572e', '#1e3a8a', '#22c55e'];

export const brandColors: SceneSetup = (harness) => {
  const { scene, camera, controls, container, renderer, onFrame } = harness;
  camera.position.set(0, 1.25, 2.4);
  controls.target.set(0, 1.25, 0);
  controls.update(); // aim the camera now: the first readout projects the swatches before the first render

  // Each brand color twice: on the left with toneMapped: false (the source), on the right tone mapped.
  const swatches: THREE.Mesh[] = [];
  BRAND.forEach((color, row) => {
    for (const toneMapped of [false, true]) {
      const swatch = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.34), new THREE.MeshBasicMaterial({ color, toneMapped }));
      swatch.position.set(toneMapped ? 0.5 : -0.5, 1.5 - row * 0.4, 0);
      scene.add(swatch);
      if (toneMapped) swatches.push(swatch);
    }
  });
  for (const [text, x] of [['toneMapped: false', -0.5], ['tone mapped', 0.5]] as const) {
    const tag = label(text, COLORS.white);
    (tag.material as THREE.SpriteMaterial).toneMapped = false;
    tag.position.set(x, 1.9, 0);
    scene.add(tag);
  }

  const readout = overlay(container, 'readout');
  let mapping = TONE_MAPPINGS[0];
  let measure = true;

  onFrame(() => {
    if (!measure) return;
    measure = false;
    const read = swatches.map((swatch) => screenColor(harness, swatch.position));
    readout.textContent = [
      `renderer.toneMapping = ${mapping.name}`,
      `source    ${BRAND.join('  ')}`,
      `on screen ${read.join('  ')}`,
    ].join('\n');
  });

  choiceButtons(
    overlay(container, 'controls'),
    TONE_MAPPINGS.map((item) => ({
      html: item.name.replace('ToneMapping', ''),
      select: () => {
        mapping = item;
        renderer.toneMapping = item.value;
        measure = true;
      },
    })),
  );
};
