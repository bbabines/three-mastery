// Projection: keep clear of a pipe. Write keepClear, then save: the page's scene runs it.
// Check it with: npm run drill -- drills/2/math/projection-rejection/apply-1
//
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import { Line3, Vector3 } from 'three';

// Where `point` may sit: unchanged if it's at least `clearance` from the pipe between pipeStart and
// pipeEnd, and otherwise pushed straight away from the nearest point on the pipe until it's exactly
// `clearance` away. The nearest point on the pipe:
//   new Line3(pipeStart, pipeEnd).closestPointToPoint(point, true, new Vector3())
// Don't change any of the vectors.
export function keepClear(point: Vector3, pipeStart: Vector3, pipeEnd: Vector3, clearance: number): Answer<Vector3> {
  return null;
}
