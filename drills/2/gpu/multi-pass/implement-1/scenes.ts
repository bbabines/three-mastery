import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { postFragments } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const width = 640, height = 360;
  {
    const result = attempt('postFragments', () => postFragments(width,height,3));
    if (result.ok) marker.scale.y = result.value / (width * height);
    readout.textContent = result.ok ? `full-screen fragment candidates: ${result.value}` : result.note;
  }
};
