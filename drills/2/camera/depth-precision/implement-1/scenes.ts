import { attempt, COLORS, hideFloorHelpers, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { comparison } from '../../compare';
import { depthAt } from './drill';

export const demo: SceneSetup = ({ scene, container }) => {
  hideFloorHelpers(scene);
  const controlsBar = overlay(container, 'controls');
  const show = comparison(container, 'Depth buffer is nonlinear');
  const lens = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  let depth = 10;
  const update = () => {
    const expected = (new THREE.Vector3(0, 0, -depth).project(lens).z + 1) / 2;
    const result = attempt('depthAt', () => depthAt(lens, depth));
    show(`view depth ${depth.toFixed(1)} world units · near 0.1, far 100`,
      result.ok ? `depth buffer ${result.value.toFixed(5)}` : result.note,
      `depth buffer ${expected.toFixed(5)}`);
  };
  slider(controlsBar, 'view depth', { min: 1, max: 60, step: 1, value: depth }, value => { depth = value; update(); });
  update();
};
