// Reference answer for drills/2/transforms/pivots/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function swingDoor(hinge: THREE.Vector3, point: THREE.Vector3, angle: number): Answer<THREE.Vector3> {
  return point.clone().sub(hinge).applyAxisAngle(new THREE.Vector3(0,1,0),angle).add(hinge);
}
