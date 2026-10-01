import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { needsDraco, loadState } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const extensions = ["KHR_draco_mesh_compression"];
  onFrame((_, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    const decoder = attempt('needsDraco', () => needsDraco(extensions)); const state = attempt('loadState', () => loadState(true, false));
    readout.textContent = [decoder.ok ? `attach Draco: ${decoder.value}` : decoder.note, state.ok ? `load state: ${state.value}` : state.note].join('\n');
  });
};
