// Runs drill.ts live: the dimension arrow uses moveBetween, and the label sits at midpoint.
import { arrow, attempt, ball, COLORS, formatVector, label, LABEL_LIFT, overlay, setArrow, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { midpoint, moveBetween } from './drill';

const part = (color: string) =>
  new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshStandardMaterial({ color }));

export const dimension: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.3, 2.4, 4.6);
  controls.target.set(0.3, 0.7, -0.5);

  const partA = part(COLORS.blue);
  const partB = part(COLORS.orange);
  const tagA = label('A', COLORS.blue);
  const tagB = label('B', COLORS.orange);
  const dimensionArrow = arrow(COLORS.yellow);
  const middle = ball(COLORS.yellow, 1, 0.1);
  const middleTag = label('midpoint', COLORS.yellow);
  scene.add(partA, partB, tagA, tagB, dimensionArrow, middle, middleTag);

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const values = { bx: 2, by: 1.2, shift: 0 };

  const update = () => {
    const a = new THREE.Vector3(-2 + values.shift, 0.5, 0);
    const b = new THREE.Vector3(values.bx + values.shift, values.by, -1);
    partA.position.copy(a);
    partB.position.copy(b);
    tagA.position.copy(a).add(LABEL_LIFT);
    tagB.position.copy(b).add(LABEL_LIFT);

    const move = attempt('moveBetween', () => moveBetween(a.clone(), b.clone()));
    if (move.ok) setArrow(dimensionArrow, a, move.value);
    else dimensionArrow.visible = false;

    const mid = attempt('midpoint', () => midpoint(a.clone(), b.clone()));
    middle.visible = middleTag.visible = mid.ok;
    if (mid.ok) {
      middle.position.copy(mid.value);
      middleTag.position.copy(mid.value).add(LABEL_LIFT);
    }

    const lands = move.ok && a.clone().add(move.value).distanceTo(b) < 1e-6;
    readout.textContent = [
      move.ok ? `moveBetween(a, b)  ${formatVector(move.value)}` : move.note,
      mid.ok ? `midpoint(a, b)     ${formatVector(mid.value)}` : mid.note,
      move.ok ? (lands ? 'a + move lands on b' : 'a + move misses b') : '',
    ]
      .filter(Boolean)
      .join('\n');
  };

  slider(bar, 'b across', { min: -1, max: 3, step: 0.1, value: values.bx }, (value) => {
    values.bx = value;
    update();
  });
  slider(bar, 'b height', { min: 0.3, max: 2.5, step: 0.1, value: values.by }, (value) => {
    values.by = value;
    update();
  });
  slider(bar, 'shift both', { min: -1.5, max: 1.5, step: 0.1, value: values.shift }, (value) => {
    values.shift = value;
    update();
  });
  update();
};
