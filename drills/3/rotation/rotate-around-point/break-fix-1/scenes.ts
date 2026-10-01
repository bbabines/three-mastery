import { attempt, ball, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { turnAtHinge } from './drill';

export const hinge: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(2, 3, 6);
  controls.target.set(0.7, 0.7, 0);
  const center = new THREE.Vector3(1, 0.7, 0);
  const point = center.clone().add(new THREE.Vector3(0.9, 0, 0));
  const hingeBall = ball(COLORS.gray, 1, 0.1);
  hingeBall.position.copy(center);
  const expectedBall = ball(COLORS.green, 0.5, 0.15);
  const yourBall = ball(COLORS.orange, 1, 0.1);
  scene.add(hingeBall, expectedBall, yourBall);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const axis = new THREE.Vector3(0, 2, 0);
  const update = (degrees: number) => {
    const angle = THREE.MathUtils.degToRad(degrees);
    const expected = center.clone().add(point.clone().sub(center).applyAxisAngle(axis.clone().normalize(), angle));
    expectedBall.position.copy(expected);
    const result = attempt('turnAtHinge', () => turnAtHinge(point.clone(), center.clone(), axis.clone(), angle));
    if (!result.ok) {
      readout.textContent = result.note;
      return;
    }
    yourBall.position.copy(result.value);
    readout.textContent = `point gap: ${result.value.distanceTo(expected).toFixed(2)}\n${result.value.distanceTo(expected) < 1e-3 ? 'orange meets green' : 'orange misses green'}`;
  };
  slider(controlsBar, 'hinge turn', { min: -180, max: 180, step: 5, value: 60 }, update);
  update(60);
};
