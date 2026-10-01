import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { retireVariant } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const root = new THREE.Group(); const geometry = new THREE.BoxGeometry(); const active = new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color: COLORS.blue})); const retired = new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color: COLORS.red})); root.add(active,retired); scene.add(root); let checked = false;
  onFrame((_, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    const result = attempt('retireVariant', () => { if (checked) return 0; const output = retireVariant(root, retired); if (output !== null) checked = true; return output; });
    readout.textContent = result.ok ? `retired resources: ${result.value}; active remains: ${root.children.includes(active)}` : result.note;
  });
};
