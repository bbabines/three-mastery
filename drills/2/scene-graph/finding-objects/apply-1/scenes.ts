import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { namedMeshes, removeTaggedHelpers } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const root = new THREE.Group(); for (let i = 0; i < 3; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), new THREE.MeshStandardMaterial({ color: COLORS.blue })); m.name = "bolt"; m.position.x = i - 1; root.add(m); } const helper = new THREE.Group(); helper.userData.helper = true; root.add(helper); scene.add(root);
  onFrame((_, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    const found = attempt('namedMeshes', () => namedMeshes(root, 'bolt')); const removed = attempt('removeTaggedHelpers', () => removeTaggedHelpers(root));
    readout.textContent = [found.ok ? `matching meshes: ${found.value.length}` : found.note, removed.ok ? `helpers removed: ${removed.value}` : removed.note].join('\n');
  });
};
