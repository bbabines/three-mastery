// Reference answer for drills/2/geometry/tangent-space/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function flipNormalGreen(sample: THREE.Vector3): Answer<THREE.Vector3> {
  return new THREE.Vector3(sample.x,1-sample.y,sample.z);
}
