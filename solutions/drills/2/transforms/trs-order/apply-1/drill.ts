// Reference answer for drills/2/transforms/trs-order/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function orbitWithScale(point: THREE.Vector3, pivot: THREE.Vector3, rotation: THREE.Quaternion, scale: THREE.Vector3): Answer<THREE.Vector3> {
  return point.clone().sub(pivot).multiply(scale).applyQuaternion(rotation).add(pivot);
}
