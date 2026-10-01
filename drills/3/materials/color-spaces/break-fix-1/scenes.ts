import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { markMaps } from './drill';
export const preview: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.5, 3);
  controls.target.set(0, 0.6, 0);
  const sample = new THREE.MeshStandardMaterial({ roughness: 0.65 });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.65, 48, 32), sample);
  mesh.position.y = 0.65;
  scene.add(mesh);
  const key = new THREE.DirectionalLight(0xffffff, 2.5);
  key.position.set(-2, 2, 3);
  scene.add(key);
  const color = new THREE.DataTexture(new Uint8Array([190, 115, 70, 255]), 1, 1, THREE.RGBAFormat);
  const normalPixels = new Uint8Array(8 * 8 * 4);
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
    normalPixels.set([x % 2 ? 84 : 172, 128, 245, 255], (y * 8 + x) * 4);
  }
  const normal = new THREE.DataTexture(normalPixels, 8, 8, THREE.RGBAFormat);
  normal.wrapS = normal.wrapT = THREE.RepeatWrapping;
  normal.repeat.set(5, 5);
  color.needsUpdate = true;
  normal.needsUpdate = true;
  const result = attempt('markMaps', () => markMaps(color, normal));
  if (result.ok) { sample.map = result.value.color; sample.normalMap = result.value.normal; }
  overlay(container, 'readout').textContent = result.ok
    ? `Color map: ${result.value.color.colorSpace}\nNormal data: ${result.value.normal.colorSpace || 'linear data'}\nLook at the lit side of the sphere for distorted normal detail.`
    : result.note;
};
