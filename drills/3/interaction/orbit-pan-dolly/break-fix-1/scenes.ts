import { attempt, ball, COLORS, line, overlay, setLine } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { focusView } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(5, 4, 7);
  controls.target.set(0, 0.5, 0);
  const focus = new THREE.Vector3(1.5, 0.8, 0);
  const probe = new THREE.PerspectiveCamera();
  probe.position.set(0, 2, 5);
  probe.lookAt(0, 0, 0);
  const expectedCamera = focus.clone().addScaledVector(probe.getWorldDirection(new THREE.Vector3()), -3);
  const orbit = { target: new THREE.Vector3() };
  const result = attempt('focusView', () => focusView(probe, orbit, focus, 3));
  const actual = ball(COLORS.blue, 1, 0.22);
  const target = ball(COLORS.red, 1, 0.14);
  const reference = ball(COLORS.yellow, 1, 0.13);
  const focusPart = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({ color: COLORS.green }));
  actual.position.copy(probe.position);
  target.position.copy(orbit.target);
  reference.position.copy(expectedCamera);
  focusPart.position.copy(focus);
  const sight = line(COLORS.blue);
  setLine(sight, actual.position, target.position);
  scene.add(actual, target, reference, focusPart, sight);
  const readout = overlay(container, 'readout');
  readout.textContent = result.ok
    ? `blue: camera; yellow: correct camera; green: focus part
red: orbit target; it should meet the green part
target error: ${orbit.target.distanceTo(focus).toFixed(2)}`
    : result.note;
};
