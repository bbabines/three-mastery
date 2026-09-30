// Signed angle: a dial you drag. Write dialTurn, then save: the page's scene runs it.
// Check it with: npm run drill -- drills/2/math/angle-between/implement-1
//
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import { Vector3 } from 'three';

// How far a drag from `from` to `to` turns a knob at `center` facing along `axis`, in radians from
// -π to π. Positive is counter-clockwise as you look at the knob's face. `axis` can be any length.
// Don't change any of the vectors.
export function dialTurn(center: Vector3, from: Vector3, to: Vector3, axis: Vector3): Answer<number> {
  return null;
}
