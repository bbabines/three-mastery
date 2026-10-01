import { attempt, ball, COLORS, line, overlay, setLine } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { isClick } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 2, 5);
  controls.target.set(0, 0.5, 0);
  const down = new THREE.Vector2(100, 100);
  const up = new THREE.Vector2(103, 104);
  const start = ball(COLORS.yellow, 1, 0.18);
  const end = ball(COLORS.blue, 1, 0.18);
  start.position.set(-0.5, 0.6, 0);
  end.position.set(0.5, 0.6, 0);
  const movement = line(COLORS.white);
  setLine(movement, start.position, end.position);
  scene.add(start, end, movement);
  const readout = overlay(container, 'readout');
  const result = attempt('isClick', () => isClick(down, up, 4, 6));
  readout.textContent = result.ok
    ? `yellow: finger down; blue: finger up
CSS motion: ${down.distanceTo(up)} px; threshold: 6 px; DPR: 4
your verdict: ${result.value ? 'click' : 'drag'}; reference: click`
    : result.note;
};
