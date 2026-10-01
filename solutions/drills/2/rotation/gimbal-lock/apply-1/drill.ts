// Reference answer for drills/2/rotation/gimbal-lock/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function smoothOrientation(start: THREE.Quaternion, end: THREE.Quaternion, fraction: number): Answer<THREE.Quaternion> {
  return start.clone().slerp(end,fraction);
}
