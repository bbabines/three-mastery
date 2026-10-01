// Euler order: a mouse-look camera. Write lookRotation, then save: the page's scene runs it.
// Check it with: npm run drill -- drills/2/rotation/euler-order/implement-1
//
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import { Euler } from 'three';

// The camera's rotation for a heading `yaw` (radians; 0 looks down −Z, positive turns left around
// the upright Y) and a tilt `pitch` (radians; positive looks up). The horizon stays level: the
// camera's own +X never tips up or down.
export function lookRotation(yaw: number, pitch: number): Answer<Euler> {
  return null;
}
