// Reference answer for drills/2/transforms/normal-matrix/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function faceToward(part: THREE.Object3D, localNormal: THREE.Vector3, worldView: THREE.Vector3): Answer<boolean> {
  part.updateWorldMatrix(true, false);
  const normal = localNormal.clone().applyMatrix3(new THREE.Matrix3().getNormalMatrix(part.matrixWorld)).normalize();
  return normal.dot(worldView) > 0;
}
