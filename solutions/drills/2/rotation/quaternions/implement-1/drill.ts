// Reference answer for drills/2/rotation/quaternions/implement-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function localDelta(orientation: THREE.Quaternion, localAxis: THREE.Vector3, radians: number): Answer<THREE.Quaternion> {
  return orientation.clone().multiply(new THREE.Quaternion().setFromAxisAngle(localAxis.clone().normalize(), radians));
}
