import { attempt, ball, COLORS, line, overlay, setLine } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { railPosition } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(3, 3, 6);
  controls.target.set(0, 0.5, 0);
  const axis = new THREE.Vector3(1, 0.4, 0.5).normalize();
  const start = new THREE.Vector3(-1, 0.5, -0.5);
  const rail = line(COLORS.yellow);
  setLine(rail, start.clone().addScaledVector(axis, -1), start.clone().addScaledVector(axis, 3));
  const yours = ball(COLORS.blue, 1, 0.24);
  const reference = ball(COLORS.yellow, 1, 0.13);
  const pointer = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 8), new THREE.MeshBasicMaterial({ color: COLORS.red, wireframe: true }));
  scene.add(rail, yours, reference, pointer);
  const readout = overlay(container, 'readout');

  onFrame((_, elapsed) => {
    const motion = new THREE.Vector3(1.3 + Math.sin(elapsed) * 0.6, 0.9, -0.5);
    const expected = start.clone().add(motion.clone().projectOnVector(axis));
    reference.position.copy(expected);
    pointer.position.copy(start).add(motion);
    const result = attempt('railPosition', () => railPosition(start.clone(), motion.clone(), axis.clone()));
    if (!result.ok) { readout.textContent = result.note; return; }
    yours.position.copy(result.value);
    readout.textContent = `blue: your part; yellow: rail and correct position
red: pointer motion, including its sideways component
off rail: ${result.value.distanceTo(expected).toFixed(2)} world units`;
  });
};
