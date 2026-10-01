// Reference answer for drills/2/transforms/update-timing/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function freshBoundsCenter(part: THREE.Object3D, localCenter: THREE.Vector3): Answer<THREE.Vector3> {
  part.updateWorldMatrix(true, false);
  return localCenter.clone().applyMatrix4(part.matrixWorld);
}
