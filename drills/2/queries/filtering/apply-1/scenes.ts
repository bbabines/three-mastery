import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { firstTargetName, rayTouchesBox } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const target = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({ color: COLORS.blue })); target.name = "part"; scene.add(target); target.updateMatrixWorld(); const ray = new THREE.Ray(new THREE.Vector3(0, 0, 5), new THREE.Vector3(0, 0, -1)); const box = new THREE.Box3().setFromObject(target);
  onFrame((_, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    const name = attempt('firstTargetName', () => firstTargetName(ray, [target])); const bounds = attempt('rayTouchesBox', () => rayTouchesBox(ray, box));
    readout.textContent = [name.ok ? `selected: ${name.value}` : name.note, bounds.ok ? `box early-out: ${bounds.value}` : bounds.note].join('\n');
  });
};
