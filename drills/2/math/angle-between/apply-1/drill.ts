// Signed angle: a compass heading. Write heading, then save: the page's scene runs it.
// Check it with: npm run drill -- drills/2/math/angle-between/apply-1
//
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import { Vector3 } from 'three';

// The compass heading of `direction` in degrees, clockwise from north as seen from above, from 0 up to
// but not including 360. North is -Z and east is +X. Ignore any tilt up or down. Don't change it.
export function heading(direction: Vector3): Answer<number> {
  return null;
}
