// Runs drill.ts live: the triangle turns red when isDegenerate says it's squashed flat. The buttons
// hand isDegenerate the same triangle in meters near the origin, or in millimeters far from it.
import { attempt, ball, buttonGroup, choiceButtons, COLORS, formatNumber, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { isDegenerate } from './drill';

const A = new THREE.Vector3(-1.5, 0.6, 0);
const B = new THREE.Vector3(1.5, 1.5, 0);
const ON_LINE = A.clone().lerp(B, 0.4);
const OUT = new THREE.Vector3(-(B.y - A.y), B.x - A.x, 0).setLength(1.2); // at right angles to AB

// The same corners as a model in millimeters, thousands of units from the origin.
const toMillimeters = (corner: THREE.Vector3) => corner.clone().multiplyScalar(1000).add(new THREE.Vector3(4000, 1400, -650));

export const squash: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.4, 4.2);
  controls.target.set(0, 1, 0);

  const geometry = new THREE.BufferGeometry();
  const material = new THREE.MeshStandardMaterial({ color: COLORS.blue, side: THREE.DoubleSide });
  const triangle = new THREE.Mesh(geometry, material);
  triangle.frustumCulled = false; // its corners move
  const edges = new THREE.LineLoop(geometry, new THREE.LineBasicMaterial({ color: COLORS.white }));
  edges.frustumCulled = false;
  const corners = [ball(COLORS.white, 1, 0.05), ball(COLORS.white, 1, 0.05), ball(COLORS.white, 1, 0.05)];
  scene.add(triangle, edges, ...corners);

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const state = { squash: 0.3, millimeters: false };

  const update = () => {
    const c = ON_LINE.clone().addScaledVector(OUT, state.squash);
    const points = [A, B, c];
    geometry.setFromPoints(points);
    geometry.computeVertexNormals();
    points.forEach((point, i) => corners[i].position.copy(point));

    const given = state.millimeters ? points.map(toMillimeters) : points.map((point) => point.clone());
    const area = new THREE.Triangle(given[0], given[1], given[2]).getArea();
    const result = attempt('isDegenerate', () => isDegenerate(given[0].clone(), given[1].clone(), given[2].clone()));
    const degenerate = result.ok && result.value;
    material.color.set(degenerate ? COLORS.red : COLORS.blue);
    (edges.material as THREE.LineBasicMaterial).color.set(degenerate ? COLORS.red : COLORS.white);
    readout.textContent = [
      `area  ${area === 0 || area >= 0.001 ? formatNumber(area, 3) : area.toExponential(2)}${state.millimeters ? ' square millimeters' : ' square meters'}`,
      result.ok ? `isDegenerate(a, b, c)  ${result.value}` : result.note,
    ].join('\n');
  };

  slider(bar, 'squash', { min: 0, max: 1, step: 0.01, value: state.squash }, (value) => {
    state.squash = value;
    update();
  });
  const units = (millimeters: boolean) => () => {
    state.millimeters = millimeters;
    update();
  };
  // choiceButtons selects the first button straight away, which draws the first frame.
  choiceButtons(buttonGroup(bar), [
    { html: 'meters', select: units(false) },
    { html: 'millimeters, far away', select: units(true) },
  ]);
};
