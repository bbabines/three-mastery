// Reference answer for drills/2/transforms/inverse-matrices/implement-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function pointInPart(part: THREE.Object3D, worldPoint: THREE.Vector3): Answer<THREE.Vector3> {
  return part.worldToLocal(worldPoint.clone());
}
