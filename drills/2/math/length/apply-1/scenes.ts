// Runs drill.ts live: every frame the drone moves to stepToward(drone, target, speed, delta), and the
// readout measures how fast it actually went.
import { attempt, ball, COLORS, formatNumber, overlay, pointer, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { stepToward } from './drill';

const HOME = new THREE.Vector3(-2.2, 0.8, 1.2);

export const drone: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(0, 4.5, 5);
  controls.target.set(0, 0.5, 0);

  const craft = pointer(COLORS.white, 0.7);
  craft.position.copy(HOME);
  const target = ball(COLORS.red, 1, 0.14);
  target.position.set(1.8, 0.8, -1.2);
  scene.add(craft, target);

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const state = { speed: 1.5, measured: 0 };

  onFrame((delta) => {
    const seconds = Math.min(delta, 0.1); // a hidden tab can pause for seconds; don't jump
    if (seconds === 0) return;
    const before = craft.position.clone();
    const result = attempt('stepToward', () => stepToward(before.clone(), target.position.clone(), state.speed, seconds));
    if (!result.ok) {
      readout.textContent = result.note;
      return;
    }
    craft.position.copy(result.value);
    const left = craft.position.distanceTo(target.position);
    if (left > 0.01) craft.lookAt(target.position);
    // Smoothed, so the number is readable.
    state.measured += (before.distanceTo(craft.position) / seconds - state.measured) * 0.1;
    readout.textContent = [
      `stepToward(drone, target, ${state.speed}, delta)`,
      `flying at  ${formatNumber(state.measured, 1)} per second`,
      `distance left  ${formatNumber(left)}`,
    ].join('\n');
  });

  slider(bar, 'target across', { min: -3, max: 3, step: 0.1, value: target.position.x }, (value) => {
    target.position.x = value;
  });
  slider(bar, 'target deep', { min: -3, max: 3, step: 0.1, value: target.position.z }, (value) => {
    target.position.z = value;
  });
  slider(bar, 'speed', { min: 0.5, max: 4, step: 0.5, value: state.speed }, (value) => {
    state.speed = value;
  });
  const restart = document.createElement('button');
  restart.textContent = 'Start over';
  restart.addEventListener('click', () => craft.position.copy(HOME));
  bar.append(restart);
};
