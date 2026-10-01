import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { frontFacePoint } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const a = new THREE.Vector3(-1, 0, 0), b = new THREE.Vector3(1, 0, 0), c = new THREE.Vector3(0, 1.5, 0); const ray = new THREE.Ray(new THREE.Vector3(0, 0.4, 3), new THREE.Vector3(0, 0, -1)); const mesh = new THREE.Mesh(new THREE.BufferGeometry().setFromPoints([a,b,c]), new THREE.MeshBasicMaterial({ color: COLORS.blue, side: THREE.DoubleSide })); scene.add(mesh);
  onFrame((_, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    const result = attempt('frontFacePoint', () => frontFacePoint(ray, a, b, c));
    readout.textContent = result.ok ? `front hit: ${result.value.toArray().map(n => n.toFixed(2)).join(', ')}` : result.note;
  });
};
