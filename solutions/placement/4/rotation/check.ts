import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function orderedTurn(x: number, y: number, z: number, order: THREE.Euler['order']): Answer<THREE.Quaternion> {
  return new THREE.Quaternion().setFromEuler(new THREE.Euler(x,y,z,order));
}

export function stableTurn(euler: THREE.Euler): Answer<THREE.Quaternion> {
  return new THREE.Quaternion().setFromEuler(euler);
}

export function axisTurn(axis: THREE.Vector3, radians: number): Answer<THREE.Quaternion> {
  return new THREE.Quaternion().setFromAxisAngle(axis.clone().normalize(),radians);
}

export function worldDelta(current: THREE.Quaternion, delta: THREE.Quaternion): Answer<THREE.Quaternion> {
  return current.clone().premultiply(delta);
}

export function halfTurn(start: THREE.Quaternion, end: THREE.Quaternion): Answer<THREE.Quaternion> {
  return start.clone().slerp(end,0.5);
}

export function forwardAxis(rotation: THREE.Quaternion): Answer<THREE.Vector3> {
  return new THREE.Vector3(0,0,1).applyQuaternion(rotation).normalize();
}

export function aimWithUp(object: THREE.Object3D, target: THREE.Vector3, up: THREE.Vector3): Answer<THREE.Quaternion> {
  object.up.copy(up); object.lookAt(target); return object.quaternion.clone();
}

export function orbitPoint(point: THREE.Vector3, pivot: THREE.Vector3, axis: THREE.Vector3, radians: number): Answer<THREE.Vector3> {
  return point.clone().sub(pivot).applyAxisAngle(axis.clone().normalize(),radians).add(pivot);
}

export function quaternionFromEuler(euler: THREE.Euler): Answer<THREE.Quaternion> {
  return new THREE.Quaternion().setFromEuler(euler);
}
