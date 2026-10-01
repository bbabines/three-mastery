// No docs: solve every part once, then run npm run pick -- done.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// object3d tour: answer from memory.
export function checkObject3dTour(part: THREE.Object3D, newParent: THREE.Object3D): Answer<THREE.Vector3> {
  return null;
}

// local vs world: answer from memory.
export function checkLocalVsWorld(part: THREE.Object3D, localOffset: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}

// matrix vs matrixworld: answer from memory.
export function checkMatrixVsMatrixworld(part: THREE.Object3D): Answer<THREE.Matrix4> {
  return null;
}

// update timing: answer from memory.
export function checkUpdateTiming(part: THREE.Object3D, localPoint: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}

// trs order: answer from memory.
export function checkTrsOrder(vertex: THREE.Vector3, position: THREE.Vector3, rotation: THREE.Quaternion, scale: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}

// compose decompose: answer from memory.
export function checkComposeDecompose(matrix: THREE.Matrix4): Answer<boolean> {
  return null;
}

// points vs directions: answer from memory.
export function checkPointsVsDirections(point: THREE.Vector3, direction: THREE.Vector3, transform: THREE.Matrix4): Answer<{ point: THREE.Vector3; direction: THREE.Vector3 }> {
  return null;
}

// inverse matrices: answer from memory.
export function checkInverseMatrices(part: THREE.Object3D, worldPoint: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}

// add vs attach: answer from memory.
export function checkAddVsAttach(part: THREE.Object3D, parent: THREE.Object3D): Answer<THREE.Vector3> {
  return null;
}

// pivots: answer from memory.
export function checkPivots(hinge: THREE.Vector3, point: THREE.Vector3, angle: number): Answer<THREE.Vector3> {
  return null;
}

// normal matrix: answer from memory.
export function checkNormalMatrix(part: THREE.Object3D, localNormal: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}

// negative scale: answer from memory.
export function checkNegativeScale(matrix: THREE.Matrix4): Answer<boolean> {
  return null;
}
