import { attempt, ball, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { hasArrived } from './drill';

export const arrival: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 2.5, 5);
  controls.target.set(0, 0.5, 0);
  const start = new THREE.Vector3(-1.5, 0.5, 0);
  const destination = new THREE.Vector3(1.5, 0.5, 0);
  const tolerance = 0.3;
  const moving = ball(COLORS.blue, 1, 0.12);
  const goal = ball(COLORS.gray, 0.25, tolerance);
  goal.position.copy(destination);
  scene.add(moving, goal);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const update = (progress: number) => {
    moving.position.copy(start).lerp(destination, progress);
    const expected = moving.position.distanceTo(destination) <= tolerance;
    const result = attempt('hasArrived', () => hasArrived(start.clone(), destination.clone(), progress, tolerance));
    if (!result.ok) {
      readout.textContent = result.note;
      return;
    }
    (goal.material as THREE.MeshStandardMaterial).color.set(result.value ? COLORS.green : COLORS.gray);
    readout.textContent = `arrival light: ${result.value ? 'on' : 'off'}\ninside radius: ${expected ? 'yes' : 'no'}\n${result.value === expected ? 'light matches position' : 'light disagrees with position'}`;
  };
  slider(controlsBar, 'progress', { min: 0, max: 1, step: 0.01, value: 0.94 }, update);
  update(0.94);
};
