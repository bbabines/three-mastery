import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { framePressure } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const cpuMs = 5, gpuMs = 20;
  {
    const result = attempt('framePressure', () => framePressure(cpuMs,gpuMs,60));
    if (result.ok) marker.position.y = result.value.frameMs / 16.67;
    readout.textContent = result.ok ? `frame: ${result.value.frameMs.toFixed(2)} ms; over: ${result.value.overBudgetMs.toFixed(2)} ms` : result.note;
  }
};
