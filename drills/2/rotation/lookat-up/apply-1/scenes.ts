// Camera −Z aims at the yellow direction; green shows the returned up axis.
import * as THREE from 'three';
import { poseView } from '../../scene-view';
import { cameraAim } from './drill';

const from = new THREE.Vector3(0, 1, 0);
const target = new THREE.Vector3(1.5, 1.8, -1.5);
const up = (degrees: number) => new THREE.Vector3(Math.sin(THREE.MathUtils.degToRad(degrees)), Math.cos(THREE.MathUtils.degToRad(degrees)), 0);
const wanted = (degrees: number) => {
  const camera = new THREE.PerspectiveCamera();
  camera.position.copy(from);
  camera.up.copy(up(degrees));
  camera.lookAt(target);
  return camera.quaternion;
};
export const demo = poseView('cameraAim', { label: 'up tilt', min: -80, max: 80, step: 5, value: 40 },
  (degrees) => cameraAim(from.clone(), target.clone(), up(degrees)), wanted, new THREE.Vector3(0, 0, -1));
