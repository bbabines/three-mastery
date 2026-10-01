import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { budgetForHz } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const hz = 60;
  {
    const result = attempt('budgetForHz', () => budgetForHz(hz));
    if (result.ok) marker.position.y = result.value / 16.67;
    readout.textContent = result.ok ? `frame budget: ${result.value.toFixed(2)} ms` : result.note;
  }
};
