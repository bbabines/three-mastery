// Reference answer for drills/2/transforms/matrix-vs-matrixworld/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function worldOrigin(part: THREE.Object3D): Answer<THREE.Vector3> {
  part.updateWorldMatrix(true, false);
  return new THREE.Vector3().setFromMatrixPosition(part.matrixWorld);
}
