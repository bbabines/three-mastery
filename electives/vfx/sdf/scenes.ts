// Scenes for the signed distance fields page, drawn with TSL on WebGPURenderer. The README places
// each one with <div data-scene="name">, and the exercise with <div data-exercise>.
import type { MaskExercise } from '@harness/exercise';
import { ball, choiceButtons, COLORS, formatNumber, line, overlay, pointerToNdc, setLine, slider } from '@harness/lesson';
import type { TslSceneSetup } from '@harness/tsl';
import { abs, color, cos, length, max, min, mix, oneMinus, smoothstep, step, uniform, uv, vec2, vec3 } from 'three/tsl';
import type { Node } from 'three/webgpu';
import * as THREE from 'three/webgpu';
import type * as Drill from './drill';

const CENTER_Y = 1.3; // the squares stand above the floor grid, facing the camera

// An unlit material whose color comes from a TSL node.
function basic(colorNode: NonNullable<THREE.MeshBasicNodeMaterial['colorNode']>) {
  const material = new THREE.MeshBasicNodeMaterial();
  material.colorNode = colorNode;
  return material;
}

// A square standing upright, facing +Z. Its UV runs 0 to 1 across each side.
function square(material: THREE.Material, size: number, x = 0) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), material);
  mesh.position.set(x, CENTER_Y, 0);
  return mesh;
}

function hideAxes(scene: THREE.Scene) {
  for (const child of scene.children) if (child instanceof THREE.AxesHelper) child.visible = false;
}

// Paints a distance field: blue inside (negative), orange outside (positive), brightest near the
// edge, with a faint band every 0.05 and a white line where the distance is 0.
function paintField(d: Node<'float'>) {
  const side = mix(color(COLORS.blue), color(COLORS.orange), step(0, d));
  const bands = cos(d.mul(Math.PI * 2 * 20)).mul(0.12).add(0.88);
  const fade = oneMinus(abs(d).mul(1.3)).max(0.3);
  const edge = oneMinus(smoothstep(0, 0.007, abs(d)));
  return mix(side.mul(bands).mul(fade), color(COLORS.white), edge);
}

const FIELD_SIZE = 2.4;
const BOX_ASPECT = 0.6; // the box is this tall for every 1 wide

// Where a point sits against the shape, measured in the square's UV units from its middle: its
// signed distance, and the nearest point on the shape's edge.
function measure(shape: 'circle' | 'box', size: number, x: number, y: number) {
  if (shape === 'circle') {
    const distance = Math.hypot(x, y);
    const nearest = distance > 1e-6 ? [(x / distance) * size, (y / distance) * size] : [size, 0];
    return { d: distance - size, nearest };
  }
  const halfX = size;
  const halfY = size * BOX_ASPECT;
  const qx = Math.abs(x) - halfX;
  const qy = Math.abs(y) - halfY;
  const d = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0);
  const clamp = THREE.MathUtils.clamp;
  let nearest: number[];
  if (qx > 0 || qy > 0) nearest = [clamp(x, -halfX, halfX), clamp(y, -halfY, halfY)];
  else if (qx > qy) nearest = [Math.sign(x) * halfX, y];
  else nearest = [x, Math.sign(y) * halfY];
  return { d, nearest };
}

export const field: TslSceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(0, CENTER_Y, 4.3);
  controls.target.set(0, CENTER_Y, 0);
  hideAxes(scene);

  const size = uniform(0.25);
  const p = uv().sub(0.5); // measured from the middle of the square
  const q = abs(p).sub(vec2(size, size.mul(BOX_ASPECT)));
  const materials = {
    circle: basic(paintField(length(p).sub(size))),
    box: basic(paintField(length(max(q, 0)).add(min(max(q.x, q.y), 0)))),
  };
  const plane = square(materials.circle, FIELD_SIZE);
  const dot = ball(COLORS.white, 1, 0.045);
  const toEdge = line(COLORS.white);
  scene.add(plane, dot, toEdge);

  let shape: 'circle' | 'box' = 'circle';
  const spot = new THREE.Vector2(0.8, 0.66); // the white dot, as a UV on the square
  const toWorld = (x: number, y: number) => new THREE.Vector3(x * FIELD_SIZE, CENTER_Y + y * FIELD_SIZE, 0.02);
  const readout = overlay(container, 'readout');
  const update = () => {
    const x = spot.x - 0.5;
    const y = spot.y - 0.5;
    const { d, nearest } = measure(shape, size.value, x, y);
    dot.position.copy(toWorld(x, y));
    setLine(toEdge, toWorld(x, y), toWorld(nearest[0], nearest[1]));
    const side = Math.abs(d) < 0.005 ? 'on the edge' : d < 0 ? 'inside' : 'outside';
    readout.textContent = [
      shape === 'circle' ? 'd = length(p).sub(radius)' : 'd = boxDistance(p, halfSize)',
      `at the white dot: d = ${formatNumber(d)}, ${side}`,
      'the white line is how far it is to the edge',
    ].join('\n');
  };

  // Move the pointer over the square to move the dot.
  const raycaster = new THREE.Raycaster();
  renderer.domElement.addEventListener('pointermove', (event) => {
    raycaster.setFromCamera(pointerToNdc(event, renderer.domElement), camera);
    const hit = raycaster.intersectObject(plane)[0];
    if (!hit?.uv) return;
    spot.copy(hit.uv);
    update();
  });

  const bar = overlay(container, 'controls');
  choiceButtons(
    bar,
    (['circle', 'box'] as const).map((name) => ({
      html: name,
      select: () => {
        shape = name;
        plane.material = materials[name];
        update();
      },
    })),
  );
  slider(bar, 'size', { min: 0.1, max: 0.4, step: 0.01, value: size.value }, (value) => {
    size.value = value;
    update();
  });
};

const RING_THICKNESS = 0.04;

export const mask: TslSceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, CENTER_Y, 3.3);
  controls.target.set(0, CENTER_Y, 0);
  hideAxes(scene);

  const radius = uniform(0.3);
  const softness = uniform(0.03);
  const p = uv().sub(0.5);
  const d = length(p).sub(radius);
  const outline = abs(d).sub(RING_THICKNESS);
  const modes = [
    {
      html: 'hard edge: <code>step</code>',
      field: d,
      mask: oneMinus(step(0, d)),
      code: ['d = length(p).sub(radius)', 'mask = oneMinus(step(0, d))'],
    },
    {
      html: 'soft edge: <code>smoothstep</code>',
      field: d,
      mask: oneMinus(smoothstep(0, softness, d)),
      code: ['d = length(p).sub(radius)', 'mask = oneMinus(smoothstep(0, softness, d))'],
    },
    {
      html: 'outline: <code>abs</code>',
      field: outline,
      mask: oneMinus(smoothstep(0, softness, outline)),
      code: [`d = abs(length(p).sub(radius)).sub(${RING_THICKNESS})`, 'mask = oneMinus(smoothstep(0, softness, d))'],
    },
  ].map((mode) => ({ ...mode, fieldMaterial: basic(paintField(mode.field)), maskMaterial: basic(vec3(mode.mask)) }));

  const left = square(modes[0].fieldMaterial, 1.7, -1);
  const right = square(modes[0].maskMaterial, 1.7, 1);
  scene.add(left, right);

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  choiceButtons(
    bar,
    modes.map((mode) => ({
      html: mode.html,
      select: () => {
        left.material = mode.fieldMaterial;
        right.material = mode.maskMaterial;
        readout.textContent = [...mode.code, 'left: the distance field · right: the mask'].join('\n');
      },
    })),
  );
  slider(bar, 'radius', { min: 0.1, max: 0.4, step: 0.01, value: radius.value }, (value) => (radius.value = value));
  slider(bar, 'softness', { min: 0.005, max: 0.15, step: 0.005, value: softness.value }, (value) => (softness.value = value));
};

export const combine: TslSceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, CENTER_Y, 4.3);
  controls.target.set(0, CENTER_Y, 0);
  hideAxes(scene);

  const gap = uniform(0.12);
  const p = uv().sub(0.5);
  const a = length(p.add(vec2(gap, 0))).sub(0.22); // circle A, left of the middle
  const b = length(p.sub(vec2(gap, 0.06))).sub(0.17); // circle B, right of the middle
  // The mask in white, with A's and B's own edges drawn over it in orange and blue.
  const edgeOf = (d: Node<'float'>) => oneMinus(smoothstep(0.002, 0.006, abs(d)));
  const paint = (d: Node<'float'>) => {
    const shape = vec3(oneMinus(smoothstep(0, 0.006, d))).mul(0.85);
    return mix(mix(shape, color(COLORS.orange), edgeOf(a)), color(COLORS.blue), edgeOf(b));
  };
  const modes = [
    { html: 'union: <code>min</code>', d: min(a, b), code: 'd = min(a, b)', says: 'inside A or inside B' },
    { html: 'overlap: <code>max</code>', d: max(a, b), code: 'd = max(a, b)', says: 'inside both' },
    { html: 'cut: <code>max</code> and <code>negate</code>', d: max(a, b.negate()), code: 'd = max(a, b.negate())', says: 'inside A, outside B' },
  ].map((mode) => ({ ...mode, material: basic(paint(mode.d)) }));

  const plane = square(modes[0].material, FIELD_SIZE);
  scene.add(plane);

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  choiceButtons(
    bar,
    modes.map((mode) => ({
      html: mode.html,
      select: () => {
        plane.material = mode.material;
        readout.textContent = [
          'a = circle A (orange edge), b = circle B (blue edge)',
          `${mode.code}   white: ${mode.says}`,
          'mask = oneMinus(smoothstep(0, 0.006, d))',
        ].join('\n');
      },
    })),
  );
  slider(bar, 'gap', { min: 0, max: 0.3, step: 0.01, value: gap.value }, (value) => (gap.value = value));
};

// The exercise: Brad's softRing next to the reference, measured at three radius and width settings.
export const exercise: MaskExercise<typeof Drill> = {
  fn: 'softRing',
  params: [
    { name: 'radius', min: 0.1, max: 0.4, step: 0.01, value: 0.3 },
    { name: 'width', min: 0.01, max: 0.2, step: 0.01, value: 0.08 },
  ],
  checks: [
    { radius: 0.3, width: 0.08 },
    { radius: 0.18, width: 0.03 },
    { radius: 0.36, width: 0.14 },
  ],
  draw: (drill, inputs) => drill.softRing(inputs.uv, inputs.params.radius, inputs.params.width),
};
