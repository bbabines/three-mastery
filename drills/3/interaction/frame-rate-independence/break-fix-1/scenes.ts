import { attempt, ball, COLORS, line, overlay, setLine } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { smoothMove } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(3, 2, 6);
  controls.target.set(0, 0.5, 0);
  const oneFrame = ball(COLORS.blue, 1, 0.21);
  const twoFrames = ball(COLORS.yellow, 1, 0.14);
  const target = ball(COLORS.green, 1, 0.14);
  const track = line(COLORS.gray);
  setLine(track, new THREE.Vector3(-2, 0.7, 0), new THREE.Vector3(2, 0.7, 0));
  target.position.set(2, 0.7, 0);
  scene.add(track, oneFrame, twoFrames, target);
  const readout = overlay(container, 'readout');
  onFrame((_, elapsed) => {
    const dt = (1 + Math.sin(elapsed * 0.7) * 0.5) / 30;
    const single = attempt('smoothMove', () => smoothMove(-2, 2, 8, dt));
    const split = attempt('smoothMove', () => smoothMove(smoothMove(-2, 2, 8, dt / 2), 2, 8, dt / 2));
    if (!single.ok) { readout.textContent = single.note; return; }
    if (!split.ok) { readout.textContent = split.note; return; }
    oneFrame.position.set(single.value, 0.7, 0);
    twoFrames.position.set(split.value, 0.7, 0);
    readout.textContent = `blue: one frame; yellow: two half frames
separation: ${Math.abs(single.value - split.value).toFixed(3)} world units
green: target`;
  });
};
