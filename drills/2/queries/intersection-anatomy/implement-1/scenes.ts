import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { worldHitNormal } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const object = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({ color: COLORS.blue })); object.scale.set(2, 1, 0.5); object.rotation.y = 0.4; scene.add(object);
  onFrame((_, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    const result = attempt('worldHitNormal', () => worldHitNormal(new THREE.Vector3(1, 1, 0).normalize(), object));
    readout.textContent = result.ok ? `world normal: ${result.value.toArray().map(n => n.toFixed(2)).join(', ')}` : result.note;
  });
};
