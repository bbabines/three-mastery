import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { wallDragDelta } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const wall = new THREE.Plane(new THREE.Vector3(0,0,1),-1); const first = new THREE.Ray(new THREE.Vector3(0,1,4),new THREE.Vector3(0,0,-1)); const next = new THREE.Ray(new THREE.Vector3(1,2,4),new THREE.Vector3(0,0,-1));
  onFrame((_, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    const result = attempt('wallDragDelta', () => wallDragDelta(first,next,wall));
    readout.textContent = result.ok ? `wall drag: ${result.value.toArray().map(n => n.toFixed(2)).join(', ')}` : result.note;
  });
};
