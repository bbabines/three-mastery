import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { focusCenter, focusEase } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const root = new THREE.Group(); const mesh = new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({color: COLORS.blue})); mesh.position.x=1; root.add(mesh); scene.add(root);
  onFrame((_, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    const center = attempt('focusCenter', () => focusCenter(root)); const eased = attempt('focusEase', () => focusEase(0.5,2));
    readout.textContent = [center.ok ? `target x: ${center.value.x.toFixed(2)}` : center.note, eased.ok ? `ease: ${eased.value.toFixed(2)}` : eased.note].join('\n');
  });
};
