import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { keepWorldOnAttach } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3.5, 3, 5);
  controls.target.set(0, 0.5, 0);
  const subject = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  const marker = ball(COLORS.yellow);
  subject.position.y = 0.5;
  marker.position.set(1.5, 0.5, 0);
  scene.add(subject, marker);
  const readout = overlay(container, 'readout');
  const parent = new THREE.Group(); parent.position.x = 2; scene.add(parent); parent.add(subject);
  const result = attempt('keepWorldOnAttach', () => keepWorldOnAttach(subject, scene));
  readout.textContent = result.ok ? `keepWorldOnAttach: ${JSON.stringify(result.value)?.slice(0, 160)}` : result.note;
};
