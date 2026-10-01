import { attempt, overlay, showCamera, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { comparison } from '../../compare';
import { lensForViewport } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(5, 4, 7); controls.target.set(0, 0.5, 0);
  const lens = new THREE.PerspectiveCamera(60, 1, 0.1, 20);
  lens.position.set(0, 1, 4); lens.lookAt(0, 1, 0);
  const helper = showCamera(lens);
  scene.add(lens, helper);
  const controlsBar = overlay(container, 'controls');
  const show = comparison(container, 'Perspective lens: width changes scale');
  let width = 600;
  const update = () => {
    lens.aspect = width / 600; lens.updateProjectionMatrix(); helper.update();
    const result = attempt('lensForViewport', () => lensForViewport(60, width, 600, 0.1, 20));
    show(`viewport ${width} × 600 CSS px · vertical FOV 60°`,
      result.ok ? `projection horizontal scale ${result.value.elements[0].toFixed(2)}` : result.note,
      `projection horizontal scale ${lens.projectionMatrix.elements[0].toFixed(2)}`);
  };
  slider(controlsBar, 'width', { min: 300, max: 1200, step: 100, value: width }, value => { width = value; update(); });
  update();
};
