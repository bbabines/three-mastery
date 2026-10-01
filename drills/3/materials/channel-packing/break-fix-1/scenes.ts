import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { readOrm } from './drill';

export const preview: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.5, 3);
  controls.target.set(0, 0.6, 0);
  const sample = new THREE.MeshStandardMaterial({ color: '#b6bfcb' });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.65, 48, 32), sample);
  mesh.position.y = 0.65;
  scene.add(mesh);
  const key = new THREE.PointLight(0xffffff, 55);
  key.position.set(-1.5, 2.5, 2);
  scene.add(key);
  const pixel = new THREE.Vector3(0.1, 0.8, 0.3);
  const result = attempt('readOrm', () => readOrm(pixel));
  if (result.ok) {
    sample.roughness = result.value.roughness;
    sample.metalness = result.value.metalness;
  }
  overlay(container, 'readout').textContent = result.ok
    ? `Packed pixel: red AO ${pixel.x} · green roughness ${pixel.y} · blue metalness ${pixel.z}\nApplied roughness: ${result.value.roughness}\nThe steel should have a broad, soft highlight.`
    : result.note;
};
