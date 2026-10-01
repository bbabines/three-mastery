// Reference answer for drills/2/transforms/points-vs-directions/implement-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function moveRay(point: THREE.Vector3, direction: THREE.Vector3, transform: THREE.Matrix4): Answer<{ point: THREE.Vector3; direction: THREE.Vector3 }> {
  return { point: point.clone().applyMatrix4(transform), direction: direction.clone().transformDirection(transform) };
}
