import { attempt, ball, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { comparison } from '../../compare';
import { viewDepth } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(5, 4, 7); controls.target.set(0, 1, 0);
  const lens = new THREE.PerspectiveCamera();
  lens.position.set(0, 1, 4);
  const marker = ball(COLORS.yellow, 1, 0.18);
  marker.position.set(1, 1, 0);
  scene.add(marker);
  const controlsBar = overlay(container, 'controls');
  const show = comparison(container, 'View depth differs from distance to the marker');
  let x = 1;
  const update = () => {
    marker.position.x = x;
    lens.updateMatrixWorld();
    const expected = -marker.position.clone().applyMatrix4(lens.matrixWorldInverse).z;
    const result = attempt('viewDepth', () => viewDepth(lens, marker.position.clone()));
    show(`side offset ${x.toFixed(1)} · straight distance ${lens.position.distanceTo(marker.position).toFixed(2)}`,
      result.ok ? `view depth ${result.value.toFixed(2)}` : result.note,
      `view depth ${expected.toFixed(2)}`);
  };
  slider(controlsBar, 'side offset', { min: -2, max: 2, step: 0.5, value: x }, value => { x = value; update(); });
  update();
};
