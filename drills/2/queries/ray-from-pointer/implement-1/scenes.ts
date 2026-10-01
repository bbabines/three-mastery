import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { pointerNdc } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const rect = { left: 120, top: 70, width: 640, height: 320 };
  onFrame((_, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    const result = attempt('pointerNdc', () => pointerNdc(440, 230, rect));
    readout.textContent = result.ok ? `NDC at canvas center: ${result.value.x.toFixed(2)}, ${result.value.y.toFixed(2)}` : result.note;
  });
};
