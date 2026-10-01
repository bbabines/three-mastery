import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { disposeMeshOwned } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const geometry = new THREE.BoxGeometry(); const texture = new THREE.Texture(); const material = new THREE.MeshStandardMaterial({ color: COLORS.blue, map: texture }); const mesh = new THREE.Mesh(geometry, material); scene.add(new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({color: COLORS.blue}))); let checked = false;
  onFrame((_, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    const result = attempt('disposeMeshOwned', () => { if (checked) return 0; const output = disposeMeshOwned(mesh, new Set([geometry])); if (output !== null) checked = true; return output; });
    readout.textContent = result.ok ? `owned resources disposed: ${result.value}` : result.note;
  });
};
