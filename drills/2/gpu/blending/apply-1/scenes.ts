import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { fadeMaterial } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 0, -1.1);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const material = new THREE.MeshBasicMaterial({color: COLORS.blue}); const mesh = new THREE.Mesh(new THREE.BoxGeometry(),material); scene.add(mesh);
  onFrame((_, elapsed) => {
    const alpha = Math.sin(elapsed * 1.2) > 0 ? 0.4 : 1;
    const result = attempt('fadeMaterial', () => fadeMaterial(material,alpha));
    readout.textContent = result.ok
      ? `blue panel: ${alpha < 1 ? 'fading' : 'opaque'}; opacity ${result.value.opacity.toFixed(2)}\ndepth writes ${result.value.depthWrite}; yellow part should show during the fade`
      : result.note;
  });
};
