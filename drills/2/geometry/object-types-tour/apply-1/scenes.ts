import { attempt, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { comparison } from '../../compare';
import { makeRepeatedParts } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(5, 4, 7); controls.target.set(1, 0.6, 0);
  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const material = new THREE.MeshStandardMaterial({ color: COLORS.blue });
  const controlsBar = overlay(container, 'controls');
  const show = comparison(container, 'One draw object, several poses');
  let active: THREE.InstancedMesh | undefined;
  let count = 4;
  const update = () => {
    if (active) scene.remove(active);
    const result = attempt('makeRepeatedParts', () => makeRepeatedParts(geometry, material, count));
    active = result.ok ? result.value : undefined;
    if (active) { active.position.y = 0.8; scene.add(active); }
    show(`count ${count}`,
      result.ok ? `${result.value.count} instances in one InstancedMesh` : result.note,
      `${count} instances at x 0…${count - 1}`);
  };
  slider(controlsBar, 'count', { min: 2, max: 6, step: 1, value: count }, value => { count = value; update(); });
  update();
};
