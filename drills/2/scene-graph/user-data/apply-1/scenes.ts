import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { selectableId, swapMaterial } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const root = new THREE.Group(); root.userData.selectableId = "cup"; const hit = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({ color: COLORS.blue })); root.add(hit); scene.add(root); const replacement = new THREE.MeshStandardMaterial({ color: COLORS.yellow });
  onFrame((_, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    const id = attempt('selectableId', () => selectableId(hit)); const old = attempt('swapMaterial', () => swapMaterial(hit, replacement));
    readout.textContent = [id.ok ? `selected: ${id.value}` : id.note, old.ok ? `original saved: ${old.value !== replacement}` : old.note].join('\n');
  });
};
