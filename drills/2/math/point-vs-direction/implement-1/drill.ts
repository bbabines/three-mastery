// Point vs direction: a dimension line. Write both functions, then save: the page's scene runs them.
// Check them with: npm run drill -- drills/2/math/point-vs-direction/implement-1
//
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import { Vector3 } from 'three';

// The move from a to b: add it to a and you land on b. Don't change a or b.
export function moveBetween(a: Vector3, b: Vector3): Answer<Vector3> {
  return null;
}

// The place halfway between a and b. Don't change a or b.
export function midpoint(a: Vector3, b: Vector3): Answer<Vector3> {
  return null;
}
