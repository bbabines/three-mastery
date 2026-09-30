// Scenes for the resolution and DPR page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, formatNumber, hideFloorHelpers, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// A plate of small print and fine lines, where the pixel ratio shows as sharpness.
function specPlate() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext('2d')!;
  context.fillStyle = '#1f2937';
  context.fillRect(0, 0, 1024, 512);
  context.strokeStyle = '#4b5563';
  context.lineWidth = 1;
  for (let x = 0; x <= 1024; x += 16) {
    context.beginPath();
    context.moveTo(x + 0.5, 0);
    context.lineTo(x + 0.5, 512);
    context.stroke();
  }
  context.fillStyle = '#e5e7eb';
  context.font = '600 64px system-ui, sans-serif';
  context.fillText('RACK R-186 · LOAD RATING', 40, 90);
  context.font = '38px system-ui, sans-serif';
  const lines = ['Max load per shelf: 250 kg', 'Uprights: 1.8 mm steel, powder coated', 'Anchor all four feet to the floor'];
  lines.forEach((text, i) => context.fillText(text, 40, 170 + i * 52));
  context.font = '24px system-ui, sans-serif';
  for (let i = 0; i < 5; i++) context.fillText('Replace this plate if it is scratched, painted over, or faded.', 40, 360 + i * 30);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.2), new THREE.MeshBasicMaterial({ map: texture }));
  plate.position.set(-0.25, 1.1, 0);
  return plate;
}

// A ball of thin lines beside the plate, where it shows as jagged or smooth edges.
function wireBall() {
  const ball = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.SphereGeometry(0.36, 20, 14)),
    new THREE.LineBasicMaterial({ color: COLORS.orange }),
  );
  ball.position.set(1.4, 1.1, 0.1);
  return ball;
}

// Where both scenes put the camera: close enough that the plate's small print tests the pixel ratio.
function frame(camera: THREE.PerspectiveCamera, target: THREE.Vector3) {
  camera.position.set(0.35, 1.25, 2.5);
  target.set(0.3, 1.18, 0);
}

const n = (value: number) => value.toLocaleString('en-US');
const RATIOS = [0.5, 0.75, 1, 1.5, 2, 3];

export const pixels: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  frame(camera, controls.target);
  hideFloorHelpers(scene);
  scene.add(specPlate(), wireBall());

  // Starts at the ratio the harness chose, Math.min(devicePixelRatio, 2), or the nearest one listed.
  const start = RATIOS.reduce((best, ratio, i) => (Math.abs(ratio - renderer.getPixelRatio()) < Math.abs(RATIOS[best] - renderer.getPixelRatio()) ? i : best), 0);
  renderer.setPixelRatio(RATIOS[start]);
  slider(overlay(container, 'controls'), 'pixel ratio', { min: 0, max: RATIOS.length - 1, step: 1, value: start }, (index) => {
    renderer.setPixelRatio(RATIOS[index]);
  });

  const readout = overlay(container, 'readout');
  const css = new THREE.Vector2();
  const device = new THREE.Vector2();
  onFrame(() => {
    const ratio = renderer.getPixelRatio();
    renderer.getSize(css);
    renderer.getDrawingBufferSize(device);
    const screen = window.devicePixelRatio;
    readout.textContent = [
      `renderer.setPixelRatio(${ratio})`,
      `canvas: ${css.x} × ${css.y} CSS pixels, drawn as ${device.x} × ${device.y} device pixels`,
      `${n(device.x * device.y)} pixels every frame: ${ratio === 1 ? 'the count at' : `${formatNumber(ratio * ratio)}×`} a pixel ratio of 1`,
      ratio > screen
        ? `above this screen's own ratio, ${formatNumber(screen)}: extra work, little to see`
        : `this screen's devicePixelRatio: ${formatNumber(screen)}`,
    ].join('\n');
  });
};

export const orbit: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  frame(camera, controls.target);
  hideFloorHelpers(scene);
  scene.add(specPlate(), wireBall());

  const full = Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(full);
  let lowerWhileOrbiting = false;
  let orbiting = false;
  const onStart = () => {
    orbiting = true;
    if (lowerWhileOrbiting) renderer.setPixelRatio(full / 2);
  };
  const onEnd = () => {
    orbiting = false;
    renderer.setPixelRatio(full);
  };
  controls.addEventListener('start', onStart);
  controls.addEventListener('end', onEnd);

  const bar = overlay(container, 'controls');
  choiceButtons(bar, [
    { html: 'keep the full ratio', select: () => ((lowerWhileOrbiting = false), onEnd()) },
    { html: 'halve it while orbiting', select: () => ((lowerWhileOrbiting = true), onEnd()) },
  ]);
  // The slider orbits too, for touch screens and checks: dragging it is a drag, and letting go ends it.
  const offset = camera.position.clone().sub(controls.target);
  const spherical = new THREE.Spherical().setFromVector3(offset);
  const startTheta = spherical.theta;
  slider(bar, 'orbit', { min: -60, max: 60, step: 1, value: 0 }, (degrees) => {
    if (!orbiting) onStart();
    spherical.theta = startTheta + THREE.MathUtils.degToRad(degrees);
    camera.position.setFromSpherical(spherical).add(controls.target);
  });
  bar.querySelector('label:last-of-type input')!.addEventListener('change', onEnd);

  const readout = overlay(container, 'readout');
  const device = new THREE.Vector2();
  onFrame(() => {
    const ratio = renderer.getPixelRatio();
    renderer.getDrawingBufferSize(device);
    const count = device.x * device.y;
    readout.textContent = [
      lowerWhileOrbiting
        ? "controls.addEventListener('start', () => renderer.setPixelRatio(full / 2))"
        : 'renderer.setPixelRatio(full) // once, at setup',
      lowerWhileOrbiting ? "controls.addEventListener('end', () => renderer.setPixelRatio(full))" : '// no start or end listeners',
      `${orbiting ? 'orbiting' : 'still'}: pixel ratio ${formatNumber(ratio)}, ${n(count)} pixels a frame`,
      ratio < full ? 'a quarter of the pixel work, until the drag ends' : `full = Math.min(devicePixelRatio, 2) = ${formatNumber(full)} on this screen`,
    ].join('\n');
  });
};
