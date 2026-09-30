// Reference answer for drills/2/math/point-vs-direction/implement-1.
import type { Answer } from '@harness/drill';
import { Vector3 } from 'three';

export function moveBetween(a: Vector3, b: Vector3): Answer<Vector3> {
  return b.clone().sub(a);
}

export function midpoint(a: Vector3, b: Vector3): Answer<Vector3> {
  return a.clone().lerp(b, 0.5);
}
