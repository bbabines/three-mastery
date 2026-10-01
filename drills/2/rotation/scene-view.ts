import { arrow, attempt, ball, COLORS, formatNumber, formatVector, overlay, pointer, setArrow, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

type Setting = { label: string; min: number; max: number; step: number; value: number };

export function pointView(
  name: string,
  start: THREE.Vector3,
  center: THREE.Vector3,
  axis: THREE.Vector3,
  run: (radians: number) => THREE.Vector3 | null,
  expected: (radians: number) => THREE.Vector3,
): SceneSetup {
  return ({ scene, camera, controls, container }) => {
    camera.position.set(5, 4, 6);
    controls.target.copy(center);
    const hinge = ball(COLORS.orange, 1, 0.18);
    hinge.position.copy(center);
    const original = ball(COLORS.gray);
    original.position.copy(start);
    const target = ball(COLORS.yellow);
    const answer = ball(COLORS.blue);
    const axisArrow = arrow(COLORS.orange);
    setArrow(axisArrow, center, axis.clone().normalize().multiplyScalar(1.5));
    scene.add(hinge, original, target, answer, axisArrow);
    const readout = overlay(container, 'readout');
    const bar = overlay(container, 'controls');
    const update = (degrees: number) => {
      const radians = THREE.MathUtils.degToRad(degrees);
      target.position.copy(expected(radians));
      const result = attempt(name, () => run(radians));
      answer.visible = result.ok;
      if (result.ok) answer.position.copy(result.value);
      readout.textContent = result.ok
        ? `${name}(${degrees}°)  ${formatVector(result.value)}\nblue to yellow  ${formatNumber(result.value.distanceTo(target.position), 2)}\n${result.value.distanceTo(target.position) < 0.01 ? 'point meets target' : 'point misses target'}`
        : result.note;
    };
    slider(bar, 'turn', { min: -170, max: 170, step: 5, value: 50 }, update);
    update(50);
  };
}

export function poseView(
  name: string,
  setting: Setting,
  run: (value: number) => THREE.Quaternion | null,
  expected: (value: number) => THREE.Quaternion,
  forward = new THREE.Vector3(0, 0, 1),
): SceneSetup {
  return ({ scene, camera, controls, container }) => {
    camera.position.set(4.5, 3.6, 5);
    controls.target.set(0, 1.1, 0);
    const origin = new THREE.Vector3(0, 1.1, 0);
    const reference = pointer(COLORS.yellow, 0.7);
    const learner = pointer(COLORS.blue, 0.5);
    reference.position.copy(origin);
    learner.position.copy(origin);
    const targetForward = arrow(COLORS.yellow);
    const answerForward = arrow(COLORS.blue);
    const targetUp = arrow(COLORS.orange);
    const answerUp = arrow(COLORS.green);
    scene.add(reference, learner, targetForward, answerForward, targetUp, answerUp);
    const readout = overlay(container, 'readout');
    const bar = overlay(container, 'controls');
    const update = (value: number) => {
      const want = expected(value);
      reference.quaternion.copy(want);
      setArrow(targetForward, origin, forward.clone().applyQuaternion(want).multiplyScalar(1.5));
      setArrow(targetUp, origin, new THREE.Vector3(0, 1, 0).applyQuaternion(want).multiplyScalar(0.9));
      const result = attempt(name, () => run(value));
      learner.visible = answerForward.visible = answerUp.visible = result.ok;
      if (!result.ok) { readout.textContent = result.note; return; }
      learner.quaternion.copy(result.value);
      setArrow(answerForward, origin, forward.clone().applyQuaternion(result.value).multiplyScalar(1.3));
      setArrow(answerUp, origin, new THREE.Vector3(0, 1, 0).applyQuaternion(result.value).multiplyScalar(0.75));
      const error = THREE.MathUtils.radToDeg(result.value.angleTo(want));
      readout.textContent = `${name}  ${formatNumber(value)}\nturn from yellow  ${formatNumber(error, 1)}°\n${error < 0.5 ? 'pose matches target' : 'pose misses target'}`;
    };
    slider(bar, setting.label, setting, update);
    update(setting.value);
  };
}

export function directionView(
  name: string,
  setting: Setting,
  run: (value: number) => THREE.Vector3 | null,
  expected: (value: number) => THREE.Vector3,
): SceneSetup {
  return ({ scene, camera, controls, container }) => {
    camera.position.set(4, 3.5, 5);
    controls.target.set(0, 1, 0);
    const origin = new THREE.Vector3(0, 1, 0);
    const reference = arrow(COLORS.yellow);
    const learner = arrow(COLORS.blue);
    const hub = ball(COLORS.gray);
    hub.position.copy(origin);
    scene.add(reference, learner, hub);
    const readout = overlay(container, 'readout');
    const bar = overlay(container, 'controls');
    const update = (value: number) => {
      const want = expected(value);
      setArrow(reference, origin, want.clone().multiplyScalar(1.5));
      const result = attempt(name, () => run(value));
      learner.visible = result.ok;
      if (!result.ok) { readout.textContent = result.note; return; }
      setArrow(learner, origin, result.value.clone().multiplyScalar(1.35));
      const error = THREE.MathUtils.radToDeg(result.value.angleTo(want));
      readout.textContent = `${name}  ${formatVector(result.value, 2)}\nlength ${formatNumber(result.value.length(), 2)}  off ${formatNumber(error, 1)}°\n${error < 0.5 && Math.abs(result.value.length() - 1) < 0.01 ? 'axis matches target' : 'axis misses target'}`;
    };
    slider(bar, setting.label, setting, update);
    update(setting.value);
  };
}
