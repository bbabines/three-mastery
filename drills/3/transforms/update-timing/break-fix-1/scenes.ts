import { attempt, ball, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { movedAnchor } from './drill';

export const door: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(1.5, 2, 4);
  controls.target.set(0, 0.8, 0);
  const door = new THREE.Mesh(new THREE.BoxGeometry(1, 1.5, 0.1), new THREE.MeshStandardMaterial({ color: COLORS.gray }));
  door.pivot = new THREE.Vector3(-0.5, 0, 0);
  door.rotation.y = 0.7;
  door.updateMatrixWorld();
  const anchor = new THREE.Vector3(-0.5, 0, 0);
  const marker = ball(COLORS.orange, 1, 0.09);
  const hinge = ball(COLORS.green, 0.5, 0.13);
  scene.add(door, marker, hinge);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const update = (x: number) => {
    const result = attempt('movedAnchor', () => movedAnchor(door, new THREE.Vector3(x, 0.8, 0), anchor.clone()));
    const expected = door.localToWorld(anchor.clone());
    hinge.position.copy(expected);
    if (!result.ok) {
      readout.textContent = result.note;
      return;
    }
    marker.position.copy(result.value);
    readout.textContent = `marker gap: ${result.value.distanceTo(expected).toFixed(2)} world units\n${result.value.distanceTo(expected) < 1e-3 ? 'marker stays on hinge' : 'marker lags behind hinge'}`;
  };
  slider(controlsBar, 'door x', { min: -1.5, max: 1.5, step: 0.1, value: 1 }, update);
  update(1);
};
