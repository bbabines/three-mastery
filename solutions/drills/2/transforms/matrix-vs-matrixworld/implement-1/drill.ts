// Reference answer for drills/2/transforms/matrix-vs-matrixworld/implement-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function worldTransform(part: THREE.Object3D): Answer<THREE.Matrix4> {
  part.updateWorldMatrix(true, false);
  return part.matrixWorld.clone();
}
