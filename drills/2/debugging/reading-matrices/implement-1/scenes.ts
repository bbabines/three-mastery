import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { matrixTranslation } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  
  const matrix = new THREE.Matrix4().makeTranslation(2,1,-3);
  onFrame((delta, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    
    const result = attempt('matrixTranslation', () => matrixTranslation(matrix));
    readout.textContent = (result.ok ? `translation: ${result.value.toArray().join(', ')}` : result.note);
  });
};
