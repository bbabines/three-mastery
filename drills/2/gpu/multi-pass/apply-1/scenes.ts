import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { outputLast } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const passes = ["render","output","bloom"];
  {
    const result = attempt('outputLast', () => outputLast(passes));
    readout.textContent = result.ok ? `passes: ${result.value.join(' → ')}` : result.note;
  }
};
