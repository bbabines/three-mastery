import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { matchPicker } from './drill';

export const preview: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.5, 3);
  controls.target.set(0, 0.5, 0);
  const cssColor = '#c7762f';
  const material = new THREE.MeshBasicMaterial({ color: '#ffffff' });
  const marker = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.1), material);
  marker.position.y = 0.5;
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const result = attempt('matchPicker', () => matchPicker(material, cssColor));
  readout.textContent = result.ok
    ? `picker: ${cssColor}\nmaterial: #${result.value.color.getHexString()}\ntone mapped: ${result.value.toneMapped ? 'yes' : 'no'}`
    : result.note;
};
