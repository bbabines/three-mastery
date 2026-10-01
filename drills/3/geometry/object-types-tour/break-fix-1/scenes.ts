import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { placeInstance } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(5, 4, 6);
  controls.target.set(0, 0.5, 0);
  const geometry = new THREE.BoxGeometry(0.7, 0.3, 0.7);
  const copies = new THREE.InstancedMesh(geometry, new THREE.MeshStandardMaterial({ color: COLORS.blue }), 3);
  [-2, 0, 2].forEach((x, i) => copies.setMatrixAt(i, new THREE.Matrix4().makeTranslation(x, 0.5, 0)));
  copies.instanceMatrix.needsUpdate = true;
  const goal = ball(COLORS.yellow, 0.5, 0.23);
  goal.position.set(3, 0.5, 0);
  scene.add(copies, goal);
  const readout = overlay(container, 'readout');
  const result = attempt('placeInstance', () => placeInstance(copies, 1, new THREE.Matrix4().makeTranslation(3, 0.5, 0)));
  const middle = new THREE.Matrix4();
  copies.getMatrixAt(1, middle);
  const placed = new THREE.Vector3().setFromMatrixPosition(middle);
  readout.textContent = result.ok
    ? `middle shelf: ${placed.x.toFixed(1)} (yellow goal: 3.0)\nwhole group: ${copies.position.x.toFixed(1)} (should stay 0)`
    : result.note;
};
