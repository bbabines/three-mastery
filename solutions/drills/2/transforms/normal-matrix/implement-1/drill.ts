// Reference answer for drills/2/transforms/normal-matrix/implement-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function normalInWorld(part: THREE.Object3D, localNormal: THREE.Vector3): Answer<THREE.Vector3> {
  part.updateWorldMatrix(true, false);
  return localNormal.clone().applyMatrix3(new THREE.Matrix3().getNormalMatrix(part.matrixWorld)).normalize();
}
