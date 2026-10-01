// Reference placement answers.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function checkObject3dTour(part: THREE.Object3D, newParent: THREE.Object3D): Answer<THREE.Vector3> {
  newParent.attach(part);
  return part.getWorldPosition(new THREE.Vector3());
}

export function checkLocalVsWorld(part: THREE.Object3D, localOffset: THREE.Vector3): Answer<THREE.Vector3> {
  return part.localToWorld(localOffset.clone());
}

export function checkMatrixVsMatrixworld(part: THREE.Object3D): Answer<THREE.Matrix4> {
  part.updateWorldMatrix(true, false);
  return part.matrixWorld.clone();
}

export function checkUpdateTiming(part: THREE.Object3D, localPoint: THREE.Vector3): Answer<THREE.Vector3> {
  part.updateWorldMatrix(true, false);
  return localPoint.clone().applyMatrix4(part.matrixWorld);
}

export function checkTrsOrder(vertex: THREE.Vector3, position: THREE.Vector3, rotation: THREE.Quaternion, scale: THREE.Vector3): Answer<THREE.Vector3> {
  return vertex.clone().applyMatrix4(new THREE.Matrix4().compose(position, rotation, scale));
}

export function checkComposeDecompose(matrix: THREE.Matrix4): Answer<boolean> {
  const p = new THREE.Vector3(), q = new THREE.Quaternion(), s = new THREE.Vector3();
  matrix.decompose(p,q,s);
  return s.x * s.y * s.z < 0;
}

export function checkPointsVsDirections(point: THREE.Vector3, direction: THREE.Vector3, transform: THREE.Matrix4): Answer<{ point: THREE.Vector3; direction: THREE.Vector3 }> {
  return { point: point.clone().applyMatrix4(transform), direction: direction.clone().transformDirection(transform) };
}

export function checkInverseMatrices(part: THREE.Object3D, worldPoint: THREE.Vector3): Answer<THREE.Vector3> {
  return part.worldToLocal(worldPoint.clone());
}

export function checkAddVsAttach(part: THREE.Object3D, parent: THREE.Object3D): Answer<THREE.Vector3> {
  const before=part.getWorldPosition(new THREE.Vector3()); parent.attach(part); return before;
}

export function checkPivots(hinge: THREE.Vector3, point: THREE.Vector3, angle: number): Answer<THREE.Vector3> {
  return point.clone().sub(hinge).applyAxisAngle(new THREE.Vector3(0,1,0),angle).add(hinge);
}

export function checkNormalMatrix(part: THREE.Object3D, localNormal: THREE.Vector3): Answer<THREE.Vector3> {
  part.updateWorldMatrix(true, false);
  return localNormal.clone().applyMatrix3(new THREE.Matrix3().getNormalMatrix(part.matrixWorld)).normalize();
}

export function checkNegativeScale(matrix: THREE.Matrix4): Answer<boolean> {
  return matrix.determinantAffine()<0;
}
