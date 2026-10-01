import { attempt, COLORS, overlay, showCamera, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { comparison } from '../../compare';
import { orthoForBox } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(5, 4, 7); controls.target.set(0, 0.5, 0);
  const lens = new THREE.OrthographicCamera(-2, 2, 2, -2, 0.1, 10);
  lens.position.set(0, 1, 4); lens.lookAt(0, 1, 0);
  const helper = showCamera(lens);
  scene.add(lens, helper);
  const controlsBar = overlay(container, 'controls');
  const show = comparison(container, 'Orthographic lens: no depth shrink');
  let right = 2;
  const update = () => {
    lens.right = right; lens.updateProjectionMatrix(); helper.update();
    const result = attempt('orthoForBox', () => orthoForBox(-2, right, 2, -2, 0.1, 10));
    show(`left −2 · right ${right.toFixed(1)} · top 2 · bottom −2`,
      result.ok ? `projection horizontal scale ${result.value.elements[0].toFixed(2)}` : result.note,
      `projection horizontal scale ${lens.projectionMatrix.elements[0].toFixed(2)}`);
  };
  slider(controlsBar, 'right bound', { min: 1, max: 4, step: 0.5, value: right }, value => { right = value; update(); });
  update();
};
