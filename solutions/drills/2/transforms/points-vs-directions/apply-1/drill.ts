// Reference answer for drills/2/transforms/points-vs-directions/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function worldVelocity(localVelocity: THREE.Vector3, transform: THREE.Matrix4): Answer<THREE.Vector3> {
  return localVelocity.clone().applyMatrix3(new THREE.Matrix3().setFromMatrix4(transform));
}
