// No docs: solve every part once, then run npm run pick -- done.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// euler order: answer from memory.
export function checkEulerOrder(angles: THREE.Vector3, order: THREE.EulerOrder): Answer<THREE.Quaternion> {
  return null;
}

// gimbal lock: answer from memory.
export function checkGimbalLock(start: THREE.Quaternion, end: THREE.Quaternion, fraction: number): Answer<THREE.Quaternion> {
  return null;
}

// axis angle: answer from memory.
export function checkAxisAngle(point: THREE.Vector3, center: THREE.Vector3, axis: THREE.Vector3, radians: number): Answer<THREE.Vector3> {
  return null;
}

// quaternions: answer from memory.
export function checkQuaternions(orientation: THREE.Quaternion, localAxis: THREE.Vector3, radians: number): Answer<THREE.Quaternion> {
  return null;
}

// slerp: answer from memory.
export function checkSlerp(a: THREE.Quaternion, b: THREE.Quaternion, fraction: number): Answer<THREE.Quaternion> {
  return null;
}

// rotation basis: answer from memory.
export function checkRotationBasis(rotationMatrix: THREE.Matrix4): Answer<THREE.Vector3> {
  return null;
}

// lookat up: answer from memory.
export function checkLookatUp(from: THREE.Vector3, target: THREE.Vector3, up: THREE.Vector3): Answer<THREE.Quaternion> {
  return null;
}

// rotate around point: answer from memory.
export function checkRotateAroundPoint(point: THREE.Vector3, center: THREE.Vector3, turn: THREE.Quaternion): Answer<THREE.Vector3> {
  return null;
}

// converting: answer from memory.
export function checkConverting(angles: THREE.Euler): Answer<THREE.Quaternion> {
  return null;
}
