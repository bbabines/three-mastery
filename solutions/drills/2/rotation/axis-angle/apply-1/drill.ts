// Reference answer for drills/2/rotation/axis-angle/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function orbitOnAxis(point: THREE.Vector3, center: THREE.Vector3, axis: THREE.Vector3, radians: number): Answer<THREE.Vector3> {
  return point.clone().sub(center).applyAxisAngle(axis.clone().normalize(),radians).add(center);
}
