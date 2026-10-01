import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { chromeFinish } from './drill';
export const preview: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.5, 3);
  controls.target.set(0, 0.5, 0);
  const sample = new THREE.MeshStandardMaterial({ color: '#c7823a' });
  const object = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 16), sample);
  object.position.y = 0.6;
  scene.add(object);

  const readout = overlay(container, 'readout');
  const result = attempt('chromeFinish', () => chromeFinish(sample));
  readout.textContent = result.ok ? `metalness: ${sample.metalness}\nroughness: ${sample.roughness}` : result.note;
};
