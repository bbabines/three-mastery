// Live measurements of the picture on screen, for readouts that report what you actually see: after
// lighting, shadows, tone mapping, and the sRGB output. The reading, key light, and grounding pages
// share it.
//
// A measurement draws the frame once more and reads its pixels straight away, before the browser
// shows the frame and clears it, so it only works inside a frame callback. measureWhenSettled runs
// one a few frames after anything changes, once the camera has stopped moving.
import type { Harness } from '@harness/scene';
import * as THREE from 'three';
import type { Stage } from '../bench';

// A byte from the screen (sRGB) back to linear light, where twice the number is twice the light.
const toLinear = (byte: number) => {
  const c = byte / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

export interface Patch {
  color: THREE.Color; // the patch's average, in linear light
  luminance: number; // its average brightness, in linear light
  contrast: number; // how much light and dark it shows: the spread of brightness over its average
}

// Reads square patches of the frame, `size` drawing-buffer pixels across, centered where each world
// point lands. Draws the frame first with `draw`, or the plain scene. A point off screen gives null.
export function readPatches(harness: Harness, points: THREE.Vector3[], size = 9, draw?: () => void): (Patch | null)[] {
  const { renderer, scene, camera } = harness;
  camera.updateMatrixWorld(); // project() reads the camera's matrices, which render() refreshes
  if (draw) draw();
  else renderer.render(scene, camera);
  const gl = renderer.getContext();
  const buffer = renderer.getDrawingBufferSize(new THREE.Vector2());
  const pixels = new Uint8Array(size * size * 4);
  return points.map((point) => {
    const ndc = point.clone().project(camera);
    if (Math.abs(ndc.x) > 1 || Math.abs(ndc.y) > 1 || ndc.z > 1) return null;
    const x = THREE.MathUtils.clamp(Math.round(((ndc.x + 1) / 2) * buffer.x - size / 2), 0, buffer.x - size);
    const y = THREE.MathUtils.clamp(Math.round(((ndc.y + 1) / 2) * buffer.y - size / 2), 0, buffer.y - size);
    gl.readPixels(x, y, size, size, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    const color = new THREE.Color(0, 0, 0);
    const values: number[] = [];
    for (let i = 0; i < pixels.length; i += 4) {
      const [r, g, b] = [toLinear(pixels[i]), toLinear(pixels[i + 1]), toLinear(pixels[i + 2])];
      color.r += r;
      color.g += g;
      color.b += b;
      values.push(0.2126 * r + 0.7152 * g + 0.0722 * b);
    }
    color.multiplyScalar(1 / values.length);
    const luminance = values.reduce((sum, v) => sum + v, 0) / values.length;
    const spread = Math.sqrt(values.reduce((sum, v) => sum + (v - luminance) ** 2, 0) / values.length);
    return { color, luminance, contrast: luminance > 0 ? spread / luminance : 0 };
  });
}

// Each pixel's brightness (linear) in a square around where a world point lands, or null off screen.
function readLuminance(harness: Harness, point: THREE.Vector3, size: number, draw?: () => void) {
  const { renderer, scene, camera } = harness;
  camera.updateMatrixWorld();
  if (draw) draw();
  else renderer.render(scene, camera);
  const ndc = point.clone().project(camera);
  if (Math.abs(ndc.x) > 1 || Math.abs(ndc.y) > 1 || ndc.z > 1) return null;
  const buffer = renderer.getDrawingBufferSize(new THREE.Vector2());
  const x = THREE.MathUtils.clamp(Math.round(((ndc.x + 1) / 2) * buffer.x - size / 2), 0, buffer.x - size);
  const y = THREE.MathUtils.clamp(Math.round(((ndc.y + 1) / 2) * buffer.y - size / 2), 0, buffer.y - size);
  const pixels = new Uint8Array(size * size * 4);
  const gl = renderer.getContext();
  gl.readPixels(x, y, size, size, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  const values = new Float32Array(size * size);
  for (let i = 0; i < values.length; i++) values[i] = 0.2126 * toLinear(pixels[i * 4]) + 0.7152 * toLinear(pixels[i * 4 + 1]) + 0.0722 * toLinear(pixels[i * 4 + 2]);
  return values;
}

// How much a material's bumps change the light in a patch of the screen: each pixel drawn with the
// normal map and again without it (normalScale 0, a uniform, so nothing rebuilds), and the
// differences added up over the light without them. 0.1 means the bumps move 10% of the patch's
// light around. Comparing pixel to pixel leaves the color map's own pattern out of it. Null when
// there's no normal map or the point is off screen.
export function relief(harness: Harness, material: THREE.MeshStandardMaterial, point: THREE.Vector3, size = 48, draw?: () => void) {
  if (!material.normalMap) return null;
  const saved = material.normalScale.clone();
  const bumpy = readLuminance(harness, point, size, draw);
  material.normalScale.set(0, 0);
  const flat = readLuminance(harness, point, size, draw);
  material.normalScale.copy(saved);
  if (!bumpy || !flat) return null;
  let changed = 0;
  let total = 0;
  for (let i = 0; i < bumpy.length; i++) {
    changed += Math.abs(bumpy[i] - flat[i]);
    total += flat[i];
  }
  return total > 0 ? changed / total : 0;
}

// The gray ball's brightest and darkest sides, as the camera sees them: seven spots on its upper
// half, from its right side over the top to its left, each 60° from the middle of the side facing
// the camera. The lower half faces the floor, which is darker in every room, so it would make even
// light look one-sided.
export function ballSides(harness: Harness, ball: THREE.Object3D, radius: number, draw?: () => void) {
  const center = ball.getWorldPosition(new THREE.Vector3());
  const toCamera = harness.camera.position.clone().sub(center).normalize();
  const side = new THREE.Vector3(0, 1, 0).cross(toCamera).normalize();
  const up = toCamera.clone().cross(side).normalize();
  const tilt = THREE.MathUtils.degToRad(60);
  const points: THREE.Vector3[] = [];
  for (let k = 0; k < 7; k++) {
    const around = (k / 6) * Math.PI;
    const direction = toCamera
      .clone()
      .multiplyScalar(Math.cos(tilt))
      .add(side.clone().multiplyScalar(Math.sin(tilt) * Math.cos(around)))
      .add(up.clone().multiplyScalar(Math.sin(tilt) * Math.sin(around)));
    points.push(center.clone().addScaledVector(direction, radius));
  }
  const patches = readPatches(harness, points, 3, draw).filter((patch): patch is Patch => patch !== null);
  if (patches.length < 2) return null;
  const sorted = [...patches].sort((a, b) => a.luminance - b.luminance);
  const dark = sorted[0];
  const bright = sorted[sorted.length - 1];
  return { bright, dark, ratio: bright.luminance / Math.max(dark.luminance, 1e-4) };
}

// Moves the gray and chrome balls to the front right of the samples. Where the bench puts them, beside
// the roll, the roll's shadow covers the gray ball whenever the key comes low from the left, and a
// ball in shadow reads the shadow, not the light.
export function ballsInFront(balls: THREE.Group) {
  const [gray, chrome] = balls.children;
  gray.position.set(0.2, 0.03, 0.25);
  chrome.position.set(0.27, 0.03, 0.2);
}

// A linear color as the '#rrggbb' you'd see on screen.
export const hex = (color: THREE.Color) => `#${color.getHexString()}`;

// Warm, cool, or neutral, from red over blue.
export function warmth(color: THREE.Color) {
  const ratio = color.r / Math.max(color.b, 1e-4);
  return ratio > 1.15 ? 'warm' : ratio < 0.87 ? 'cool' : 'neutral';
}

// Calls `measure` from a frame a few frames after the stage changes or the camera stops moving.
// Returns a function that asks for a new measurement.
export function settled(harness: Harness, stage: Stage) {
  let wait = 3;
  const again = () => {
    wait = 3;
  };
  stage.onChange(again);
  harness.controls.addEventListener('change', again);
  return { again, due: () => wait > 0 && --wait === 0 };
}

export function measureWhenSettled(harness: Harness, stage: Stage, measure: () => void) {
  const timing = settled(harness, stage);
  harness.onFrame(() => {
    if (timing.due()) measure();
  });
  return timing.again;
}

// A readout with two parts: the code for the current settings, written when they change, and the
// measurement, written when it comes in.
export function twoPartReadout(element: HTMLElement) {
  const parts = { code: [] as string[], measured: [] as string[] };
  const write = () => (element.textContent = [...parts.code, ...parts.measured].join('\n'));
  return {
    code(lines: string[]) {
      parts.code = lines;
      write();
    },
    measured(lines: string[]) {
      parts.measured = lines;
      write();
    },
  };
}

// A point on the swatch's front face, where the relief readouts look: the middle, or `up` of the
// way from the middle to the top edge (the roll's shadow can reach the middle).
export function swatchFace(swatch: THREE.Mesh, up = 0) {
  swatch.updateMatrixWorld();
  const box = (swatch.geometry.boundingBox ?? (swatch.geometry.computeBoundingBox(), swatch.geometry.boundingBox))!;
  return new THREE.Vector3(0, up * box.max.y, box.max.z).applyMatrix4(swatch.matrixWorld);
}
