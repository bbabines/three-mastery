// Reference answer for drills/2/transforms/update-timing/implement-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function freshWorldPoint(part: THREE.Object3D, localPoint: THREE.Vector3): Answer<THREE.Vector3> {
  part.updateWorldMatrix(true, false);
  return localPoint.clone().applyMatrix4(part.matrixWorld);
}
