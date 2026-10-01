// Reference answer for drills/2/geometry/tangent-space/implement-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function normalFromMap(sample: THREE.Vector3, tangent: THREE.Vector3, bitangent: THREE.Vector3, normal: THREE.Vector3): Answer<THREE.Vector3> {
  const map=sample.clone().multiplyScalar(2).subScalar(1);
  return tangent.clone().multiplyScalar(map.x).addScaledVector(bitangent,map.y).addScaledVector(normal,map.z).normalize();
}
