import { attempt, ball, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { comparison } from '../../compare';
import { worldToView } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(5, 4, 7); controls.target.set(0, 1, 0);
  const lens = new THREE.PerspectiveCamera();
  lens.position.set(0, 1, 4);
  const marker = ball(COLORS.yellow, 1, 0.18);
  marker.position.set(1, 1, 0);
  scene.add(marker);
  const controlsBar = overlay(container, 'controls');
  const show = comparison(container, 'Fixed world marker in moving camera space');
  let cameraX = 0;
  const update = () => {
    lens.position.x = cameraX; lens.updateMatrixWorld();
    const expected = marker.position.clone().applyMatrix4(lens.matrixWorldInverse);
    const result = attempt('worldToView', () => worldToView(lens, marker.position.clone()));
    show(`world marker x 1 · camera x ${cameraX.toFixed(1)}`,
      result.ok ? `view x ${result.value.x.toFixed(2)}, z ${result.value.z.toFixed(2)}` : result.note,
      `view x ${expected.x.toFixed(2)}, z ${expected.z.toFixed(2)}`);
  };
  slider(controlsBar, 'camera x', { min: -2, max: 2, step: 0.5, value: cameraX }, value => { cameraX = value; update(); });
  update();
};
