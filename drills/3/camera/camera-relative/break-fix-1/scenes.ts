import { arrow, attempt, COLORS, overlay, setArrow, showCamera, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { cameraRight } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3.5, 3, 6);
  controls.target.set(0, 1, 0);
  const eye = new THREE.PerspectiveCamera(45, 1, 0.1, 2);
  eye.position.y = 1;
  const helper = showCamera(eye);
  scene.add(eye, helper);
  const yours = arrow(COLORS.blue);
  const reference = arrow(COLORS.green);
  scene.add(yours, reference);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');

  const update = (pitch: number) => {
    eye.rotation.x = THREE.MathUtils.degToRad(pitch);
    eye.updateWorldMatrix(true, false);
    helper.update();
    const expected = new THREE.Vector3().setFromMatrixColumn(eye.matrixWorld, 0).normalize();
    const result = attempt('cameraRight', () => cameraRight(eye));
    setArrow(reference, new THREE.Vector3(0.6, 1, 0), expected.multiplyScalar(1.2));
    if (!result.ok) { yours.visible = false; readout.textContent = result.note; return; }
    setArrow(yours, new THREE.Vector3(-1.8, 1, 0), result.value.clone().multiplyScalar(1.2));
    readout.textContent = `pitch ${pitch}° · blue: your screen right · green: reference\nyour length ${result.value.length().toFixed(2)} (goal: 1.00)`;
  };
  slider(controlsBar, 'tilt up', { min: 0, max: 90, step: 5, value: 90 }, update);
  update(90);
};
