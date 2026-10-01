import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { needsControlsUpdate, dollyChanges } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const activeCamera = new THREE.PerspectiveCamera();
  {
    const update = attempt('needsControlsUpdate', () => needsControlsUpdate(true,false)); const dolly = attempt('dollyChanges', () => dollyChanges(activeCamera));
    readout.textContent = [update.ok ? `update controls: ${update.value}` : update.note, dolly.ok ? `dolly changes: ${dolly.value}` : dolly.note].join('\n');
  }
};
