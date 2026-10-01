import { attempt, ball, COLORS, overlay, showCamera, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { comparison } from '../../compare';
import { distanceForRadius, worldPerPixel } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(6, 4, 7); controls.target.set(0, 1, 0);
  const sphere = ball(COLORS.green, 1, 1);
  sphere.position.y = 1.2;
  const lens = new THREE.PerspectiveCamera(60, 1, 0.1, 30);
  lens.position.set(0, 1.2, 5); lens.lookAt(sphere.position);
  const helper = showCamera(lens);
  scene.add(sphere, lens, helper);
  const controlsBar = overlay(container, 'controls');
  const show = comparison(container, 'Sphere fit and world units per CSS pixel');
  let aspect = 0.6;
  const update = () => {
    lens.aspect = aspect; lens.updateProjectionMatrix();
    const vertical = THREE.MathUtils.degToRad(60) / 2;
    const horizontal = Math.atan(Math.tan(vertical) * aspect);
    const expected = 1 / Math.sin(Math.min(vertical, horizontal));
    const result = attempt('distanceForRadius', () => distanceForRadius(1, 60, aspect));
    const size = attempt('worldPerPixel', () => worldPerPixel(5, 60, 600));
    lens.position.z = result.ok ? result.value : expected; lens.updateMatrixWorld();
    helper.update();
    show(`radius 1 · aspect ${aspect.toFixed(2)} · depth 5, canvas 600 CSS px`,
      !result.ok ? result.note : !size.ok ? size.note : `distance ${result.value.toFixed(2)} · one CSS px ${size.value.toFixed(4)} world units`,
      `distance ${expected.toFixed(2)} · one CSS px ${(10 * Math.tan(vertical) / 600).toFixed(4)} world units`);
  };
  slider(controlsBar, 'aspect', { min: 0.5, max: 2, step: 0.1, value: aspect }, value => { aspect = value; update(); });
  update();
};
