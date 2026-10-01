import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { setExposureStops } from './drill';
export const preview: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(0, 1.5, 3);
  controls.target.set(0, 0.5, 0);
  const sample = new THREE.MeshStandardMaterial({ color: '#c7823a' });
  const object = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 16), sample);
  object.position.y = 0.6;
  scene.add(object);
  const toneSettings = { toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1 };
  const readout = overlay(container, 'readout');
  const result = attempt('setExposureStops', () => setExposureStops(toneSettings, -1));
  if (result.ok) { renderer.toneMapping = result.value.toneMapping; renderer.toneMappingExposure = result.value.toneMappingExposure; }
 readout.textContent = result.ok ? `stops: -1\nexposure: ${renderer.toneMappingExposure}` : result.note;
};
