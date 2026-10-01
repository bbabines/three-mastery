import { attempt, ball, COLORS, line, overlay, setLine } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { moveByWorld } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3, 3, 6);
  controls.target.set(0, 0.5, 0);
  const parent = new THREE.Group();
  parent.position.set(-1, 0.7, 0);
  parent.rotation.y = 0.8;
  const part = ball(COLORS.blue, 1, 0.23);
  parent.add(part);
  scene.add(parent);
  const delta = new THREE.Vector3(1.5, 0, 0);
  const start = part.getWorldPosition(new THREE.Vector3());
  const expected = start.clone().add(delta);
  const reference = ball(COLORS.yellow, 1, 0.13);
  reference.position.copy(expected);
  const path = line(COLORS.yellow);
  setLine(path, start, expected);
  scene.add(reference, path);
  const readout = overlay(container, 'readout');
  const result = attempt('moveByWorld', () => moveByWorld(part, delta.clone()));
  readout.textContent = result.ok
    ? `blue: moved part; yellow: world X destination
world-space error: ${part.getWorldPosition(new THREE.Vector3()).distanceTo(expected).toFixed(2)}`
    : result.note;
};
