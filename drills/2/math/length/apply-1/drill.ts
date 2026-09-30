// Length and normalize: fly toward a target. Write stepToward, then save: the page's scene runs it.
// Check it with: npm run drill -- drills/2/math/length/apply-1
//
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import { Vector3 } from 'three';

// The drone's next position: `speed * delta` closer to `target` along a straight line, landing
// exactly on the target if it's closer than that, and staying put if it's already there.
// `delta` is the seconds since the last frame. Don't change position or target.
export function stepToward(position: Vector3, target: Vector3, speed: number, delta: number): Answer<Vector3> {
  return null;
}
