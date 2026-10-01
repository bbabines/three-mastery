import { COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { findSku } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(4, 3, 6);
  controls.target.set(0, 0.5, 0);
  const root = new THREE.Group();
  const parts = ['A-1', 'B-2'].map((sku, i) => {
    const part = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
    part.name = 'Imported_1';
    part.userData.sku = sku;
    part.position.set(i ? 1.2 : -1.2, 0.6, 0);
    root.add(part);
    return part;
  });
  scene.add(root);
  scene.add(new THREE.BoxHelper(parts[1], COLORS.green));
  const readout = overlay(container, 'readout');
  try {
    const found = findSku(root, 'B-2');
    if (found instanceof THREE.Mesh) (found.material as THREE.MeshStandardMaterial).color.set(COLORS.yellow);
    readout.textContent = `both parts are named Imported_1\ngreen outline: SKU B-2 | yellow: your pick\ncorrect part found: ${found === parts[1]}`;
  } catch (error) { readout.textContent = `findSku threw: ${String(error)}`; }
};
