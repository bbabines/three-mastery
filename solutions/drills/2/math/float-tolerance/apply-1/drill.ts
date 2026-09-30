// Reference answer for drills/2/math/float-tolerance/apply-1.
import type { Answer } from '@harness/drill';
import { Plane, Vector3 } from 'three';

export function isFlatPanel(a: Vector3, b: Vector3, c: Vector3, d: Vector3, tolerance: number): Answer<boolean> {
  const plane = new Plane().setFromCoplanarPoints(a, b, c);
  return Math.abs(plane.distanceToPoint(d)) <= tolerance;
}
