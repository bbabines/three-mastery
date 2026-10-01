import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { moveAlongLocalX } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const parent = new THREE.Group(); parent.rotation.y=0.4; const child = new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({color: COLORS.blue})); child.rotation.z=0.5; parent.add(child); scene.add(parent);
  {
    const result = attempt('moveAlongLocalX', () => moveAlongLocalX(child,1)); if (result.ok) marker.position.copy(parent.localToWorld(result.value.clone()));
    readout.textContent = result.ok ? `child parent-space position: ${result.value.x.toFixed(2)}, ${result.value.y.toFixed(2)}` : result.note;
  }
};
