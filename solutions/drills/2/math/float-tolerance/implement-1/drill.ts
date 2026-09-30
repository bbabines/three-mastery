// Reference answer for drills/2/math/float-tolerance/implement-1.
import type { Answer } from '@harness/drill';
import { Triangle, Vector3 } from 'three';

export function isDegenerate(a: Vector3, b: Vector3, c: Vector3): Answer<boolean> {
  const area = new Triangle(a, b, c).getArea();
  const longest = Math.max(a.distanceTo(b), b.distanceTo(c), c.distanceTo(a));
  // Relative to the triangle's own size, so it works at any scale. A real triangle a hundred times
  // longer than it's wide comes to about 0.005; rounding leaves corners on a line far below 1e-9.
  return area <= 1e-9 * longest * longest;
}
