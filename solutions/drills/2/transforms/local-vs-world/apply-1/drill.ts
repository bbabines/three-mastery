// Reference answer for drills/2/transforms/local-vs-world/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function lightWorld(part: THREE.Object3D, localOffset: THREE.Vector3): Answer<THREE.Vector3> {
  return part.localToWorld(localOffset.clone());
}
