import { attempt, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { visibleMeshCount } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(4, 3, 6);
  controls.target.set(0, 0.5, 0);
  const root = new THREE.Group();
  const visible = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  visible.position.set(-1.2, 0.6, 0);
  const hidden = new THREE.Group();
  hidden.visible = false;
  for (const x of [0, 1.2]) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({ color: COLORS.red }));
    mesh.position.set(x, 0.6, 0);
    hidden.add(mesh);
  }
  root.add(visible, hidden);
  scene.add(root);
  const got = attempt('visibleMeshCount', () => visibleMeshCount(root));
  const readout = overlay(container, 'readout');
  readout.textContent = got.ok
    ? `visible blue meshes: 1\nyour count: ${got.value}\nhidden subtree: 2 red meshes`
    : got.note;
};
