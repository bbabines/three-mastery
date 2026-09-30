// Cross product: left or right on a route. Write turnAt, then save: the page's scene runs it.
// Check it with: npm run drill -- drills/2/math/cross-product/apply-1
//
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import { Vector3 } from 'three';

export type Turn = 'left' | 'right' | 'straight';

// Which way the route turns at `corner`, arriving from `previous` and leaving toward `next`. Y is up.
// 'straight' when the cross product's up part is between -0.000001 and 0.000001.
// Don't change any of the points.
export function turnAt(previous: Vector3, corner: Vector3, next: Vector3): Answer<Turn> {
  return null;
}
