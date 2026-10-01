import { attempt, ball, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { lampPosition } from './drill';

export const lamp: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3, 3, 6);
  controls.target.set(0, 1, 0);
  const rack = new THREE.Group();
  const part = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.5), new THREE.MeshStandardMaterial({ color: COLORS.green }));
  part.position.set(0.8, 0.6, 0);
  rack.add(part);
  scene.add(rack);
  const lampMesh = ball(COLORS.orange, 1, 0.12);
  scene.add(lampMesh);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const update = (x: number) => {
    rack.position.set(x, 0.3, -0.3);
    rack.rotation.y = 0.6;
    const expected = part.getWorldPosition(new THREE.Vector3());
    const result = attempt('lampPosition', () => lampPosition(part));
    if (!result.ok) {
      readout.textContent = result.note;
      return;
    }
    lampMesh.position.copy(result.value);
    readout.textContent = `lamp gap: ${result.value.distanceTo(expected).toFixed(2)} world units\n${result.value.distanceTo(expected) < 1e-3 ? 'lamp sits on part' : 'lamp misses part'}`;
  };
  slider(controlsBar, 'rack x', { min: -2, max: 2, step: 0.1, value: 1 }, update);
  update(1);
};
