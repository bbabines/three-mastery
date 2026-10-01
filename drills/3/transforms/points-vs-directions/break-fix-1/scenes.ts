import { arrow, attempt, COLORS, overlay, setArrow, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { worldVelocity } from './drill';

export const velocity: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 2.5, 6);
  controls.target.set(0, 0, 0);
  const part = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshStandardMaterial({ color: COLORS.gray }));
  part.rotation.y = 0.6;
  part.scale.set(1.5, 1, 0.8);
  const yours = arrow(COLORS.orange);
  const expectedArrow = arrow(COLORS.green);
  scene.add(part, yours, expectedArrow);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const local = new THREE.Vector3(0.4, 0, -0.8);
  const update = (x: number) => {
    part.position.x = x;
    part.updateWorldMatrix(true, false);
    const expected = local.clone().applyMatrix3(new THREE.Matrix3().setFromMatrix4(part.matrixWorld));
    setArrow(expectedArrow, part.position, expected);
    const result = attempt('worldVelocity', () => worldVelocity(part, local.clone()));
    if (!result.ok) {
      readout.textContent = result.note;
      return;
    }
    setArrow(yours, part.position, result.value);
    readout.textContent = `velocity difference: ${result.value.distanceTo(expected).toFixed(2)}\n${result.value.distanceTo(expected) < 1e-3 ? 'orange matches green' : 'orange drifts from green'}`;
  };
  slider(controlsBar, 'part x', { min: -2, max: 2, step: 0.1, value: 1.5 }, update);
  update(1.5);
};
