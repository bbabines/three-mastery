// Reference answer for drills/2/transforms/inverse-matrices/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function undoTransform(worldPoint: THREE.Vector3, modelToWorld: THREE.Matrix4): Answer<THREE.Vector3> {
  return worldPoint.clone().applyMatrix4(modelToWorld.clone().invert());
}
