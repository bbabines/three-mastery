// Reference answer for drills/2/rotation/quaternions/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function parentDelta(orientation: THREE.Quaternion, parentAxis: THREE.Vector3, radians: number): Answer<THREE.Quaternion> {
  return orientation.clone().premultiply(new THREE.Quaternion().setFromAxisAngle(parentAxis.clone().normalize(), radians));
}
