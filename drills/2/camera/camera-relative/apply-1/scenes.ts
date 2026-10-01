import { arrow, attempt, COLORS, formatVector, overlay, setArrow, showCamera, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { comparison } from '../../compare';
import { screenAxes } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3, 2.6, 5);
  controls.target.set(0, 0.5, 0);
  const eye = new THREE.PerspectiveCamera(55, 1, 0.1, 2);
  eye.position.set(-0.9, 0.8, 0);
  scene.add(eye, showCamera(eye));
  const right = arrow(COLORS.green), up = arrow(COLORS.yellow), forward = arrow(COLORS.blue);
  scene.add(right, up, forward);
  const controlsBar = overlay(container, 'controls');
  const show = comparison(container, 'Camera screen axes in the world');
  const update = (pitch: number) => {
    eye.rotation.set(pitch, 0.45, 0, 'YXZ');
    eye.updateMatrixWorld(true);
    const expected = {
      right: new THREE.Vector3(1, 0, 0).applyQuaternion(eye.quaternion),
      up: new THREE.Vector3(0, 1, 0).applyQuaternion(eye.quaternion),
      forward: new THREE.Vector3(0, 0, -1).applyQuaternion(eye.quaternion),
    };
    setArrow(right, eye.position, expected.right);
    setArrow(up, eye.position, expected.up);
    setArrow(forward, eye.position, expected.forward);
    const result = attempt('screenAxes', () => screenAxes(eye));
    show(`pitch ${THREE.MathUtils.radToDeg(pitch).toFixed(0)}°`,
      result.ok ? `right ${formatVector(result.value.right)} · up ${formatVector(result.value.up)}` : result.note,
      `right ${formatVector(expected.right)} · up ${formatVector(expected.up)}`);
  };
  slider(controlsBar, 'pitch', { min: 0, max: 1.57, step: 0.1, value: 0.8 }, update);
  update(0.8);
};
