// Reference answer for drills/2/math/reflection/apply-1.
import type { Answer } from '@harness/drill';
import { Vector3 } from 'three';

// The way the mirror's front faces, at whatever length the cross product gives.
const facing = (a: Vector3, b: Vector3, c: Vector3) => new Vector3().crossVectors(b.clone().sub(a), c.clone().sub(a));

export function inFront(a: Vector3, b: Vector3, c: Vector3, point: Vector3): Answer<boolean> {
  return facing(a, b, c).dot(point.clone().sub(a)) > 0;
}

export function mirrorImage(a: Vector3, b: Vector3, c: Vector3, point: Vector3): Answer<Vector3> {
  const normal = facing(a, b, c).normalize(); // reflect needs a normal of length 1
  const move = point.clone().sub(a);
  // reflect flips the part of the move along the normal, so the image lands on the other side.
  return move.reflect(normal).add(a);
}
