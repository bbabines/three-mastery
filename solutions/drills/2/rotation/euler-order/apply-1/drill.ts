// Reference answer for drills/2/rotation/euler-order/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function importTurn(angles: THREE.Vector3, order: THREE.EulerOrder): Answer<THREE.Quaternion> {
  return new THREE.Quaternion().setFromEuler(new THREE.Euler(angles.x, angles.y, angles.z, order));
}
