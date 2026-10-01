// Reference placement answers.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function checkEulerOrder(angles: THREE.Vector3, order: THREE.EulerOrder): Answer<THREE.Quaternion> {
  return new THREE.Quaternion().setFromEuler(new THREE.Euler(angles.x, angles.y, angles.z, order));
}

export function checkGimbalLock(start: THREE.Quaternion, end: THREE.Quaternion, fraction: number): Answer<THREE.Quaternion> {
  return start.clone().slerp(end,fraction);
}

export function checkAxisAngle(point: THREE.Vector3, center: THREE.Vector3, axis: THREE.Vector3, radians: number): Answer<THREE.Vector3> {
  return point.clone().sub(center).applyAxisAngle(axis.clone().normalize(),radians).add(center);
}

export function checkQuaternions(orientation: THREE.Quaternion, localAxis: THREE.Vector3, radians: number): Answer<THREE.Quaternion> {
  return orientation.clone().multiply(new THREE.Quaternion().setFromAxisAngle(localAxis.clone().normalize(), radians));
}

export function checkSlerp(a: THREE.Quaternion, b: THREE.Quaternion, fraction: number): Answer<THREE.Quaternion> {
  return a.clone().slerp(b,fraction);
}

export function checkRotationBasis(rotationMatrix: THREE.Matrix4): Answer<THREE.Vector3> {
  return new THREE.Vector3().setFromMatrixColumn(rotationMatrix,2).normalize();
}

export function checkLookatUp(from: THREE.Vector3, target: THREE.Vector3, up: THREE.Vector3): Answer<THREE.Quaternion> {
  const object=new THREE.Object3D(); object.position.copy(from); object.up.copy(up); object.lookAt(target); return object.quaternion.clone();
}

export function checkRotateAroundPoint(point: THREE.Vector3, center: THREE.Vector3, turn: THREE.Quaternion): Answer<THREE.Vector3> {
  return point.clone().sub(center).applyQuaternion(turn).add(center);
}

export function checkConverting(angles: THREE.Euler): Answer<THREE.Quaternion> {
  return new THREE.Quaternion().setFromEuler(angles);
}
