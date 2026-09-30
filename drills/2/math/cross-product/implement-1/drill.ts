// Cross product: a right and an up for any forward. Write axesFor, then save: the page's scene runs it.
// Check it with: npm run drill -- drills/2/math/cross-product/implement-1
//
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import { Vector3 } from 'three';

// The right and up that go with `forward`, both at length 1:
//   right  at right angles to forward and worldUp, on your right as you face along forward
//   up     at right angles to forward and right, on worldUp's side
// When forward points straight along worldUp, use (0, 0, 1) in place of worldUp.
// Don't change forward or worldUp.
export function axesFor(forward: Vector3, worldUp: Vector3): Answer<{ right: Vector3; up: Vector3 }> {
  return null;
}
