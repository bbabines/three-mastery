import { arrow, attempt, COLORS, overlay, setArrow, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { cameraOrientation } from './drill';

export const camera: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 2, 4);
  controls.target.set(0, 0, 0);
  const yours = arrow(COLORS.orange);
  const reference = arrow(COLORS.green);
  scene.add(yours, reference);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const yaw = 0.8;
  const update = (degrees: number) => {
    const pitch = THREE.MathUtils.degToRad(degrees);
    const expected = new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, yaw, 0, 'YXZ'));
    setArrow(reference, new THREE.Vector3(), new THREE.Vector3(0, 0, -1).applyQuaternion(expected));
    const result = attempt('cameraOrientation', () => cameraOrientation(yaw, pitch, 0));
    if (!result.ok) {
      readout.textContent = result.note;
      return;
    }
    setArrow(yours, new THREE.Vector3(), new THREE.Vector3(0, 0, -1).applyQuaternion(result.value));
    const error = THREE.MathUtils.radToDeg(result.value.angleTo(expected));
    readout.textContent = `orientation gap: ${error.toFixed(1)}°\n${error < 1e-3 ? 'arrows align' : 'arrows separate'}`;
  };
  slider(controlsBar, 'pitch', { min: -85, max: 85, step: 5, value: 65 }, update);
  update(65);
};
