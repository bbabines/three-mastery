import { arrow, attempt, COLORS, overlay, setArrow, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { forwardFromEuler } from './drill';

export const basis: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 2.5, 5);
  controls.target.set(0, 0, 0);
  const yours = arrow(COLORS.orange), reference = arrow(COLORS.green);
  scene.add(yours, reference);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const update = (degrees: number) => {
    const angles = new THREE.Euler(0.4, THREE.MathUtils.degToRad(degrees), -0.2, 'YXZ');
    const expected = new THREE.Vector3(0, 0, 1).applyEuler(angles);
    setArrow(reference, new THREE.Vector3(), expected);
    const result = attempt('forwardFromEuler', () => forwardFromEuler(angles.clone()));
    if (!result.ok) {
      readout.textContent = result.note;
      return;
    }
    setArrow(yours, new THREE.Vector3(), result.value);
    const error = THREE.MathUtils.radToDeg(result.value.angleTo(expected));
    readout.textContent = `forward error: ${error.toFixed(1)}°\n${error < 1e-3 ? 'arrows align' : 'arrows disagree'}`;
  };
  slider(controlsBar, 'yaw', { min: -90, max: 90, step: 5, value: 45 }, update);
  update(45);
};
