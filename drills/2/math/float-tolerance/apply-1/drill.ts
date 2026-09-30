// Tolerance: is the panel flat? Write isFlatPanel, then save: the page's scene runs it.
// Check it with: npm run drill -- drills/2/math/float-tolerance/apply-1
//
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import { Plane, Vector3 } from 'three';

// True when corner `d` is within `tolerance` of the flat surface through a, b, and c, on either side.
//   new Plane().setFromCoplanarPoints(a, b, c)   the surface
//   plane.distanceToPoint(d)                     how far d is from it, positive or negative
// Don't change the corners.
export function isFlatPanel(a: Vector3, b: Vector3, c: Vector3, d: Vector3, tolerance: number): Answer<boolean> {
  return null;
}
