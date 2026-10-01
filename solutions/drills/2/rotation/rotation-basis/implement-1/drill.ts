// Reference answer for drills/2/rotation/rotation-basis/implement-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function forwardFromBasis(rotationMatrix: THREE.Matrix4): Answer<THREE.Vector3> {
  return new THREE.Vector3().setFromMatrixColumn(rotationMatrix,2).normalize();
}
