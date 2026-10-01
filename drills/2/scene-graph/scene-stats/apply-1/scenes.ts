import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { uniqueGeometryCount, rendersForCamera } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const root = new THREE.Group(); const shared = new THREE.BoxGeometry(); const mesh = new THREE.Mesh(shared, new THREE.MeshStandardMaterial({ color: COLORS.blue })); root.add(mesh, new THREE.Mesh(shared, new THREE.MeshStandardMaterial({ color: COLORS.red }))); scene.add(root);
  onFrame((_, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    const count = attempt('uniqueGeometryCount', () => uniqueGeometryCount(root)); const visible = attempt('rendersForCamera', () => rendersForCamera(mesh, camera));
    readout.textContent = [count.ok ? `unique geometries: ${count.value}` : count.note, visible.ok ? `mesh renders: ${visible.value}` : visible.note].join('\n');
  });
};
