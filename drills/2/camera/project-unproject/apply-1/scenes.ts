import { attempt, ball, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { comparison } from '../../compare';
import { pointAtNdcDepth } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(5, 4, 7); controls.target.set(0, 1, 0);
  const lens = new THREE.PerspectiveCamera(55, 1.3, 0.1, 15);
  lens.position.set(-1, 1, 4); lens.lookAt(0, 1, 0); lens.updateMatrixWorld();
  const ours = ball(COLORS.blue, 1, 0.14), reference = ball(COLORS.green, 1, 0.14);
  scene.add(ours, reference);
  const controlsBar = overlay(container, 'controls');
  const show = comparison(container, 'One NDC spot, different world depths');
  let ndcDepth = 0;
  const update = () => {
    const requested = new THREE.Vector3(0.3, -0.25, ndcDepth);
    const expected = requested.clone().unproject(lens);
    const result = attempt('pointAtNdcDepth', () => pointAtNdcDepth(lens, requested.x, requested.y, requested.z));
    reference.position.copy(expected);
    ours.visible = result.ok;
    if (result.ok) ours.position.copy(result.value);
    show(`NDC (0.30, −0.25, ${ndcDepth.toFixed(1)})`,
      result.ok ? `world (${result.value.x.toFixed(2)}, ${result.value.y.toFixed(2)}, ${result.value.z.toFixed(2)})` : result.note,
      `world (${expected.x.toFixed(2)}, ${expected.y.toFixed(2)}, ${expected.z.toFixed(2)})`);
  };
  slider(controlsBar, 'ndc depth', { min: -0.8, max: 0.8, step: 0.2, value: ndcDepth }, value => { ndcDepth = value; update(); });
  update();
};
