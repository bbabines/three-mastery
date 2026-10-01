// Reference answer for drills/2/rotation/converting/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function orientationFromEuler(angles: THREE.Euler): Answer<THREE.Quaternion> {
  return new THREE.Quaternion().setFromEuler(angles);
}
