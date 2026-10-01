import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { visibleMeshes } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const root = new THREE.Group(); const shown = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({ color: COLORS.blue })); const hidden = new THREE.Group(); hidden.visible = false; hidden.add(new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial())); root.add(shown, hidden); scene.add(root);
  onFrame((_, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    const result = attempt('visibleMeshes', () => visibleMeshes(root));
    readout.textContent = result.ok ? `visible meshes: ${result.value.length} (one branch is hidden)` : result.note;
  });
};
