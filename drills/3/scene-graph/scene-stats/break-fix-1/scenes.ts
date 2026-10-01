import { attempt, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { visibleLayerMeshes } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(4, 3, 6);
  controls.target.set(0, 0.5, 0);
  camera.layers.enable(1);
  camera.layers.enable(3);
  const root = new THREE.Group();
  const onLayer = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  onLayer.layers.set(3);
  onLayer.position.set(-1, 0.6, 0);
  const otherLayer = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({ color: COLORS.yellow }));
  otherLayer.layers.set(1);
  otherLayer.position.set(1, 0.6, 0);
  root.add(onLayer, otherLayer);
  scene.add(root);
  const got = attempt('visibleLayerMeshes', () => visibleLayerMeshes(root, 3));
  const readout = overlay(container, 'readout');
  readout.textContent = got.ok
    ? `blue: layer 3 | yellow: layer 1\nyour layer-3 count: ${got.value}\nreference count: 1`
    : got.note;
};
