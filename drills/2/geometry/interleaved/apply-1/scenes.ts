import { attempt, ball, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { comparison } from '../../compare';
import { moveInterleavedVertex } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3, 3, 5); controls.target.set(0, 0.8, 0);
  const data = new THREE.InterleavedBuffer(new Float32Array([-1, 0.7, 0, 0, 0, 1, 0.7, 0, 1, 1]), 5);
  const position = new THREE.InterleavedBufferAttribute(data, 3, 0);
  const uv = new THREE.InterleavedBufferAttribute(data, 2, 3);
  const source = ball(COLORS.gray, 1, 0.14), yours = ball(COLORS.blue, 1, 0.17), reference = ball(COLORS.green, 1, 0.17);
  source.position.set(-1, 0.7, 0); scene.add(source, yours, reference);
  const controlsBar = overlay(container, 'controls');
  const show = comparison(container, 'Edit one interleaved vertex');
  let x = 2;
  const update = () => {
    const target = new THREE.Vector3(x, 0.7, 0);
    reference.position.copy(target);
    const result = attempt('moveInterleavedVertex', () => moveInterleavedVertex(position, 1, target.clone()));
    yours.visible = result.ok;
    if (result.ok) yours.position.set(position.getX(1), position.getY(1), position.getZ(1));
    show(`vertex 1 → x ${x.toFixed(1)} · UV should stay (1, 1)`,
      result.ok ? `position x ${position.getX(1).toFixed(1)} · UV (${uv.getX(1)}, ${uv.getY(1)})` : result.note,
      `position x ${x.toFixed(1)} · UV (1, 1)`);
  };
  slider(controlsBar, 'new x', { min: 1, max: 3, step: 0.5, value: x }, value => { x = value; update(); });
  update();
};
