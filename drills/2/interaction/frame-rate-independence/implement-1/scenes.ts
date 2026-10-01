import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { dampingFraction } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const lambda = 4, dt = 1/60;
  {
    const result = attempt('dampingFraction', () => dampingFraction(lambda,dt));
    if (result.ok) marker.position.x = -1 + 2 * result.value;
    readout.textContent = result.ok ? `blend this frame: ${result.value.toFixed(3)}` : result.note;
  }
};
