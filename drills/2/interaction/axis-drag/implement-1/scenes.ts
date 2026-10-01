import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { railDelta } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const start = new THREE.Vector3(-1,1,0), end = new THREE.Vector3(1,2,0), axis = new THREE.Vector3(1,1,0);
  const rail = new THREE.ArrowHelper(axis.clone().normalize(), start, 2.5, COLORS.blue); scene.add(rail);
  {
    const result = attempt('railDelta', () => railDelta(start,end,axis));
    if (result.ok) marker.position.copy(start).add(result.value);
    readout.textContent = result.ok ? `along rail: ${result.value.toArray().map(n => n.toFixed(2)).join(', ')}` : result.note;
  }
};
