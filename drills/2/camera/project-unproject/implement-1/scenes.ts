import { attempt, ball, COLORS, overlay, screenTag, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { comparison } from '../../compare';
import { labelPosition } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(5, 4, 7); controls.target.set(0, 1, 0);
  const lens = new THREE.PerspectiveCamera(55, 1, 0.1, 20);
  lens.position.set(0, 1, 5); lens.lookAt(0, 1, 0);
  const point = ball(COLORS.yellow, 1, 0.18);
  point.position.set(1, 1, 0);
  scene.add(point);
  const yours = screenTag(container, 'your label', COLORS.blue);
  const reference = screenTag(container, 'reference', COLORS.green);
  const controlsBar = overlay(container, 'controls');
  const show = comparison(container, 'World marker → CSS label');
  let x = 1;
  const update = () => {
    point.position.x = x;
    lens.updateMatrixWorld();
    const width = container.clientWidth, height = container.clientHeight;
    lens.aspect = width / height; lens.updateProjectionMatrix();
    const expected = point.position.clone().project(lens);
    const refX = (expected.x + 1) * width / 2, refY = (1 - expected.y) * height / 2;
    const result = attempt('labelPosition', () => labelPosition(lens, point.position.clone(), width, height));
    reference.style.left = `${refX}px`; reference.style.top = `${refY}px`;
    yours.style.display = result.ok ? '' : 'none';
    if (result.ok) { yours.style.left = `${result.value.x}px`; yours.style.top = `${result.value.y}px`; }
    show(`world marker x ${x.toFixed(1)}`,
      result.ok ? `CSS (${result.value.x.toFixed(0)}, ${result.value.y.toFixed(0)}), NDC z ${result.value.z.toFixed(2)}` : result.note,
      `CSS (${refX.toFixed(0)}, ${refY.toFixed(0)}), NDC z ${expected.z.toFixed(2)}`);
  };
  slider(controlsBar, 'marker x', { min: -2, max: 2, step: 0.5, value: x }, value => { x = value; update(); });
  update();
};
