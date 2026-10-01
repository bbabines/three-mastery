import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { planeDragPoint } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const ray = new THREE.Ray(new THREE.Vector3(-2, 2, 0), new THREE.Vector3(1, -0.5, 0).normalize()); const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  onFrame((_, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    const result = attempt('planeDragPoint', () => planeDragPoint(ray, plane));
    readout.textContent = result.ok ? `plane point: ${result.value.toArray().map(n => n.toFixed(2)).join(', ')}` : result.note;
  });
};
