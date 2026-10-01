import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { positiveSide, worldAabbSize } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1), new THREE.MeshStandardMaterial({ color: COLORS.blue })); mesh.rotation.y = Math.PI / 4; scene.add(mesh); const plane = new THREE.Plane(new THREE.Vector3(0,1,0), 0);
  onFrame((_, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    const side = attempt('positiveSide', () => positiveSide(plane, new THREE.Vector3(0,1,0))); const size = attempt('worldAabbSize', () => worldAabbSize(mesh));
    readout.textContent = [side.ok ? `above plane: ${side.value}` : side.note, size.ok ? `AABB width: ${size.value.x.toFixed(2)}` : size.note].join('\n');
  });
};
