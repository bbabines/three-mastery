import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { pickName } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const root = new THREE.Group(); const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({ color: COLORS.blue })); mesh.name = "part"; root.add(mesh); scene.add(root); camera.position.set(0, 1, 5); camera.lookAt(0, 0, 0); camera.updateMatrixWorld(); root.updateMatrixWorld(true);
  onFrame((_, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    const result = attempt('pickName', () => pickName(new THREE.Vector2(0, 0), camera, root));
    readout.textContent = result.ok ? `center pick: ${result.value || 'nothing'}` : result.note;
  });
};
