import { attempt, ball, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { comparison } from '../../compare';
import { vertexPosition } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3, 3, 5); controls.target.set(0, 0.8, 0);
  const position = new THREE.Float32BufferAttribute([-1, 0.5, 0, 0, 1.3, 0.2, 1, 0.7, -0.5], 3);
  const markers = [0, 1, 2].map(i => {
    const marker = ball(COLORS.green, 1, 0.13);
    marker.position.fromBufferAttribute(position, i); scene.add(marker); return marker;
  });
  const yours = ball(COLORS.blue, 1, 0.18); scene.add(yours);
  const controlsBar = overlay(container, 'controls');
  const show = comparison(container, 'Read one vertex position');
  let index = 1;
  const update = () => {
    const expected = markers[index].position;
    const result = attempt('vertexPosition', () => vertexPosition(position, index));
    yours.visible = result.ok;
    if (result.ok) yours.position.copy(result.value);
    show(`vertex ${index} of 3`,
      result.ok ? `position (${result.value.x.toFixed(1)}, ${result.value.y.toFixed(1)}, ${result.value.z.toFixed(1)})` : result.note,
      `position (${expected.x.toFixed(1)}, ${expected.y.toFixed(1)}, ${expected.z.toFixed(1)})`);
  };
  slider(controlsBar, 'vertex', { min: 0, max: 2, step: 1, value: index }, value => { index = value; update(); });
  update();
};
