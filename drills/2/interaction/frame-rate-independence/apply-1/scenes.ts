import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { smoothedTarget } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const current = new THREE.Vector3(-1,1,0), target = new THREE.Vector3(1,1,0);
  {
    const result = attempt('smoothedTarget', () => smoothedTarget(current,target,4,1/30));
    if (result.ok) marker.position.copy(result.value);
    readout.textContent = result.ok ? `smoothed x: ${result.value.x.toFixed(2)}` : result.note;
  }
};
