import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { alphaCutout } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const material = new THREE.MeshBasicMaterial({color: COLORS.blue,transparent:true}); const mesh = new THREE.Mesh(new THREE.BoxGeometry(),material); scene.add(mesh);
  onFrame((_, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    const result = attempt('alphaCutout', () => alphaCutout(material,0.45));
    readout.textContent = result.ok ? `cutoff: ${result.value.alphaTest.toFixed(2)}; depth write: ${result.value.depthWrite}` : result.note;
  });
};
