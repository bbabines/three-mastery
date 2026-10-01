import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { planeDragLocal } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const parent = new THREE.Group(); parent.rotation.y = 0.4; const child = new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({color: COLORS.blue})); parent.add(child); scene.add(parent); const plane = new THREE.Plane(new THREE.Vector3(0,1,0),0); const ray = new THREE.Ray(new THREE.Vector3(1,3,1),new THREE.Vector3(0,-1,0));
  onFrame((_, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    const result = attempt('planeDragLocal', () => planeDragLocal(ray,plane,new THREE.Vector3(0.3,0,0),child)); if (result.ok) child.position.copy(result.value);
    readout.textContent = result.ok ? `child local x: ${result.value.x.toFixed(2)}` : result.note;
  });
};
