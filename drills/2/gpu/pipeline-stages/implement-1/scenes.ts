import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { stageWork } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const vertices = 6, samples = 640*360;
  {
    const result = attempt('stageWork', () => stageWork(vertices,samples,2));
    if (result.ok) marker.scale.y = result.value.fragment / samples;
    readout.textContent = result.ok ? `vertex work: ${result.value.vertex}; fragment candidates: ${result.value.fragment}` : result.note;
  }
};
