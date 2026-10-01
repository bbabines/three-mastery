import { attempt, ball, COLORS, overlay, showCamera, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { comparison } from '../../compare';
import { visibleAfterResize } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(7, 4, 7); controls.target.set(0, 0.7, 0);
  const lens = new THREE.PerspectiveCamera(60, 2, 0.1, 20);
  lens.position.set(0, 0.7, 5); lens.lookAt(0, 0.7, 0);
  const helper = showCamera(lens);
  const target = ball(COLORS.yellow, 1, 0.18);
  target.position.set(3, 0.7, 0);
  scene.add(lens, helper, target);
  const controlsBar = overlay(container, 'controls');
  const show = comparison(container, 'Side marker and resized view frustum');
  let width = 800;
  const update = () => {
    lens.aspect = width / 400; lens.updateProjectionMatrix(); lens.updateMatrixWorld(true); helper.update();
    const expected = new THREE.Frustum().setFromProjectionMatrix(
      new THREE.Matrix4().multiplyMatrices(lens.projectionMatrix, lens.matrixWorldInverse)).containsPoint(target.position);
    const result = attempt('visibleAfterResize', () => visibleAfterResize(lens, width, 400, target.position.clone()));
    show(`viewport ${width} × 400 CSS px`,
      result.ok ? `marker ${result.value ? 'inside' : 'outside'}` : result.note,
      `marker ${expected ? 'inside' : 'outside'}`);
  };
  slider(controlsBar, 'width', { min: 200, max: 900, step: 100, value: width }, value => { width = value; update(); });
  update();
};
