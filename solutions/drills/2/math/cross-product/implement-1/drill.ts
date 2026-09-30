// Reference answer for drills/2/math/cross-product/implement-1.
import type { Answer } from '@harness/drill';
import { Vector3 } from 'three';

export function axesFor(forward: Vector3, worldUp: Vector3): Answer<{ right: Vector3; up: Vector3 }> {
  const f = forward.clone().normalize();
  const right = new Vector3().crossVectors(f, worldUp.clone().normalize());
  // Parallel inputs cross to (0, 0, 0), and rounding can leave a tiny leftover instead.
  if (right.lengthSq() < 1e-12) right.crossVectors(f, new Vector3(0, 0, 1));
  right.normalize();
  const up = new Vector3().crossVectors(right, f).normalize();
  return { right, up };
}
