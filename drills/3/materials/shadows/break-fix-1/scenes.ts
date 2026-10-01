import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { fitProductShadow } from './drill';

export const preview: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(2, 2, 3);
  controls.target.set(0, 0.3, 0);
  renderer.shadowMap.enabled = true;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(3, 3), new THREE.MeshStandardMaterial({ color: '#c8d2dc' }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  const product = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 24), new THREE.MeshStandardMaterial({ color: '#b5824c' }));
  product.position.y = 0.52;
  product.castShadow = true;
  scene.add(product);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const key = new THREE.DirectionalLight(0xffffff, 3);
  key.position.set(1, 3, 2);
  key.target.position.set(0, 0, 0);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  scene.add(key, key.target);
  const result = attempt('fitProductShadow', () => fitProductShadow(key, 2));
  overlay(container, 'readout').textContent = result.ok
    ? `Shadow camera spans ${result.value.shadow.camera.right - result.value.shadow.camera.left} world units\nMap: ${result.value.shadow.mapSize.x} texels across\nDensity: ${Math.round(result.value.shadow.mapSize.x / (result.value.shadow.camera.right - result.value.shadow.camera.left))} texels per world unit`
    : result.note;
};
