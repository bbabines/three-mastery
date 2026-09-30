// Reference answer for drills/2/math/angle-between/implement-1.
import type { Answer } from '@harness/drill';
import { Vector3 } from 'three';

export function dialTurn(center: Vector3, from: Vector3, to: Vector3, axis: Vector3): Answer<number> {
  const start = from.clone().sub(center);
  const now = to.clone().sub(center);
  const cross = new Vector3().crossVectors(start, now);
  return Math.atan2(cross.dot(axis.clone().normalize()), start.dot(now));
}
