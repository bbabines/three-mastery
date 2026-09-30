// Reflection and the triple product: a mirror camera. Write both functions, then save: the page's
// scene runs them. Check them with: npm run drill -- drills/2/math/reflection/apply-1
//
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import { Vector3 } from 'three';

// a, b, and c are three corners of the mirror, counter-clockwise as seen from the front. The mirror
// carries on past its edges. Neither function may change any of the vectors.

// True when `point` is on the mirror's front side.
export function inFront(a: Vector3, b: Vector3, c: Vector3, point: Vector3): Answer<boolean> {
  return null;
}

// Where `point`'s reflection appears: straight across the mirror, as far behind it as `point` is in
// front.
export function mirrorImage(a: Vector3, b: Vector3, c: Vector3, point: Vector3): Answer<Vector3> {
  return null;
}
