import { arrow, attempt, COLORS, overlay, setArrow, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { aimCamera } from './drill';

export const topdown: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const yourUp = arrow(COLORS.orange), correctUp = arrow(COLORS.green);
  scene.add(yourUp, correctUp);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const target = new THREE.Vector3();
  const desiredUp = new THREE.Vector3(0, 0, -1);
  const update = (x: number) => {
    const subject = new THREE.PerspectiveCamera();
    subject.position.set(x, 3, 0.4);
    const reference = new THREE.PerspectiveCamera();
    reference.position.copy(subject.position);
    reference.up.copy(desiredUp);
    reference.lookAt(target);
    setArrow(correctUp, new THREE.Vector3(), new THREE.Vector3(0, 1, 0).applyQuaternion(reference.quaternion));
    const result = attempt('aimCamera', () => aimCamera(subject, target.clone(), desiredUp.clone()));
    if (!result.ok) {
      readout.textContent = result.note;
      return;
    }
    setArrow(yourUp, new THREE.Vector3(), new THREE.Vector3(0, 1, 0).applyQuaternion(result.value));
    const error = THREE.MathUtils.radToDeg(result.value.angleTo(reference.quaternion));
    readout.textContent = `view roll gap: ${error.toFixed(1)}°\n${error < 1e-3 ? 'up arrows align' : 'up arrows disagree'}`;
  };
  slider(controlsBar, 'camera x', { min: -2, max: 2, step: 0.1, value: 0.5 }, update);
  update(0.5);
};
