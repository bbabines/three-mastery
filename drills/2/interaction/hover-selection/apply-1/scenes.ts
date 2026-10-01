import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { partState, setOrbitDragState } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const controlsState = { enabled: true };
  onFrame((_, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    const part = attempt('partState', () => partState(true,false)); const orbit = attempt('setOrbitDragState', () => setOrbitDragState(controlsState,true));
    readout.textContent = [part.ok ? `part state: ${part.value}` : part.note, orbit.ok ? `orbit enabled: ${orbit.value}` : orbit.note].join('\n');
  });
};
