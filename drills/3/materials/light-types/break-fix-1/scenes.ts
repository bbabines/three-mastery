import { attempt, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import {pointIllumination} from './drill';
export const preview: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.2, 3);
  controls.target.set(0, 0.5, 0);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.2), new THREE.MeshBasicMaterial({ color: '#ffffff' }));
  wall.position.y = 0.6;
  scene.add(wall);
  const readout = overlay(container, 'readout');
  const update = (distance: number) => {
    const result = attempt('pointIllumination', () => pointIllumination(400, distance));
    if (!result.ok) { readout.textContent = result.note; return; }
    wall.material.color.setScalar(Math.min(1, result.value / 8));
    readout.textContent = `Light to wall: ${distance} m\nWall illuminance: ${result.value.toFixed(2)}\nCompare 2 m and 4 m.`;
  };
  slider(overlay(container, 'controls'), 'wall distance', { min: 2, max: 8, step: 1, value: 2 }, update);
  update(2);
};
