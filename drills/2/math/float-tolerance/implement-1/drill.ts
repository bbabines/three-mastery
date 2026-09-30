// Tolerance: spot a squashed triangle. Write isDegenerate, then save: the page's scene runs it.
// Check it with: npm run drill -- drills/2/math/float-tolerance/implement-1
//
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import { Triangle, Vector3 } from 'three';

// True when the triangle is squashed flat, with its corners on one line. It has to work in meters
// and in millimeters, near the origin or far from it, and a thin triangle that's really there isn't
// degenerate. new Triangle(a, b, c).getArea() gives the area. Don't change the corners.
export function isDegenerate(a: Vector3, b: Vector3, c: Vector3): Answer<boolean> {
  return null;
}
