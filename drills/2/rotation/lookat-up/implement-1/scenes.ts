// A regular part aims +Z at the target; green marks its returned up axis.
import * as THREE from 'three';
import { poseView } from '../../scene-view';
import { aimWithUp } from './drill';

const from = new THREE.Vector3(0, 1, 0);
const target = new THREE.Vector3(1.5, 1.8, -1.5);
const up = (degrees: number) => new THREE.Vector3(Math.sin(THREE.MathUtils.degToRad(degrees)), Math.cos(THREE.MathUtils.degToRad(degrees)), 0);
const wanted = (degrees: number) => {
  const part = new THREE.Object3D();
  part.position.copy(from);
  part.up.copy(up(degrees));
  part.lookAt(target);
  return part.quaternion;
};
export const demo = poseView('aimWithUp', { label: 'up tilt', min: -80, max: 80, step: 5, value: 40 },
  (degrees) => aimWithUp(from.clone(), target.clone(), up(degrees)), wanted);
