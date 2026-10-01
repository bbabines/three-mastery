import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { cloneForVariant } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const root = new THREE.Group(); const source = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({ color: COLORS.blue })); root.add(source); scene.add(root); let displayed = false;
  onFrame((_, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    const result = attempt('cloneForVariant', () => cloneForVariant(root)); if (result.ok && !displayed) { result.value.position.x = 1.5; scene.add(result.value); displayed = true; }
    readout.textContent = result.ok ? `variant created: ${result.value !== root}` : result.note;
  });
};
