// Dot product: a vision cone. Write canSee, then save: the page's scene runs it.
// Check it with: npm run drill -- drills/2/math/dot-product/implement-1
//
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import { Vector3 } from 'three';

// True when `target` is within `range` of `eye` and within `halfAngle` degrees of `facing`.
// `facing` can be any length. Don't change any of the vectors.
export function canSee(eye: Vector3, facing: Vector3, target: Vector3, halfAngle: number, range: number): Answer<boolean> {
  return null;
}
