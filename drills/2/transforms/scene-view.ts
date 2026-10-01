import { arrow, attempt, ball, COLORS, formatNumber, formatVector, overlay, setArrow, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

export type Setting = { label: string; min: number; max: number; step: number; value: number };

export function pointView(
  name: string,
  setting: Setting,
  start: THREE.Vector3 | ((value: number) => THREE.Vector3),
  run: (value: number) => THREE.Vector3 | null,
  expected: (value: number) => THREE.Vector3,
  decorate?: (scene: THREE.Scene, value: number) => void,
): SceneSetup {
  return ({ scene, camera, controls, container }) => {
    camera.position.set(5, 4, 6);
    controls.target.set(0, 1, 0);
    const source = ball(COLORS.gray, 1, 0.12);
    const target = ball(COLORS.yellow, 1, 0.18);
    const answer = ball(COLORS.blue, 1, 0.13);
    scene.add(source, target, answer);
    const readout = overlay(container, 'readout');
    const bar = overlay(container, 'controls');
    const update = (value: number) => {
      decorate?.(scene, value);
      source.position.copy(typeof start === 'function' ? start(value) : start);
      target.position.copy(expected(value));
      const result = attempt(name, () => run(value));
      answer.visible = result.ok;
      if (!result.ok) { readout.textContent = result.note; return; }
      answer.position.copy(result.value);
      const gap = result.value.distanceTo(target.position);
      readout.textContent = `${name}  ${formatVector(result.value)}\nblue to yellow  ${formatNumber(gap, 2)}\n${gap < 0.01 ? 'marker meets target' : 'marker misses target'}`;
    };
    slider(bar, setting.label, setting, update);
    update(setting.value);
  };
}

export function vectorView(
  name: string,
  setting: Setting,
  run: (value: number) => THREE.Vector3 | null,
  expected: (value: number) => THREE.Vector3,
  decorate?: (scene: THREE.Scene, value: number) => void,
): SceneSetup {
  return ({ scene, camera, controls, container }) => {
    camera.position.set(4.5, 3.4, 5);
    controls.target.set(0, 1, 0);
    const base = new THREE.Vector3(0, 1, 0);
    const target = arrow(COLORS.yellow);
    const answer = arrow(COLORS.blue);
    scene.add(target, answer);
    const readout = overlay(container, 'readout');
    const bar = overlay(container, 'controls');
    const update = (value: number) => {
      decorate?.(scene, value);
      const want = expected(value);
      setArrow(target, base, want.clone().multiplyScalar(1.4));
      const result = attempt(name, () => run(value));
      answer.visible = result.ok;
      if (!result.ok) { readout.textContent = result.note; return; }
      setArrow(answer, base, result.value.clone().multiplyScalar(1.25));
      const gap = result.value.distanceTo(want);
      readout.textContent = `${name}  ${formatVector(result.value, 2)}\nvector gap  ${formatNumber(gap, 2)}\n${gap < 0.01 ? 'arrow matches target' : 'arrow misses target'}`;
    };
    slider(bar, setting.label, setting, update);
    update(setting.value);
  };
}

export function flagView(
  name: string,
  setting: Setting,
  run: (value: number) => boolean | null,
  expected: (value: number) => boolean,
  decorate?: (scene: THREE.Scene, value: number) => void,
): SceneSetup {
  return ({ scene, camera, controls, container }) => {
    camera.position.set(4.5, 3.2, 5);
    controls.target.set(0, 1, 0);
    const readout = overlay(container, 'readout');
    const bar = overlay(container, 'controls');
    const update = (value: number) => {
      decorate?.(scene, value);
      const want = expected(value);
      const result = attempt(name, () => run(value));
      readout.textContent = result.ok
        ? `${name}  ${result.value ? 'yes' : 'no'}\nyellow target  ${want ? 'yes' : 'no'}\n${result.value === want ? 'decision matches target' : 'decision misses target'}`
        : result.note;
    };
    slider(bar, setting.label, setting, update);
    update(setting.value);
  };
}
