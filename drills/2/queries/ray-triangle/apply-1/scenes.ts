import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { uvAtPoint } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const a = new THREE.Vector3(0, 0, 0), b = new THREE.Vector3(2, 0, 0), c = new THREE.Vector3(0, 2, 0), point = new THREE.Vector3(0.6, 1, 0);
  onFrame((_, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    const result = attempt('uvAtPoint', () => uvAtPoint(point, a, b, c, new THREE.Vector2(0,0), new THREE.Vector2(1,0), new THREE.Vector2(0,1)));
    readout.textContent = result.ok ? `UV at hit: ${result.value.x.toFixed(2)}, ${result.value.y.toFixed(2)}` : result.note;
  });
};
