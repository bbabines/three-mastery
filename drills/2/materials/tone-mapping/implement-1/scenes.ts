import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { productToneSetup } from './drill';
export const preview: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(0, 1.5, 3);
  controls.target.set(0, 0.5, 0);
  const sample = new THREE.MeshStandardMaterial({ color: '#c7823a' });
  const object = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 16), sample);
  object.position.y = 0.6;
  scene.add(object);

  const readout = overlay(container, 'readout');
  const result = attempt('productToneSetup', () => productToneSetup(1.3));
  if (result.ok) { renderer.toneMapping = result.value.toneMapping; renderer.toneMappingExposure = result.value.exposure; }
 readout.textContent = result.ok ? `tone mapping: Neutral\nexposure: ${renderer.toneMappingExposure}` : result.note;
};
