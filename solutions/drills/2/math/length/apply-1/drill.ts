// Reference answer for drills/2/math/length/apply-1.
import type { Answer } from '@harness/drill';
import { Vector3 } from 'three';

export function stepToward(position: Vector3, target: Vector3, speed: number, delta: number): Answer<Vector3> {
  const toTarget = target.clone().sub(position);
  const step = speed * delta;
  if (toTarget.length() <= step) return target.clone();
  return position.clone().addScaledVector(toTarget.normalize(), step);
}
