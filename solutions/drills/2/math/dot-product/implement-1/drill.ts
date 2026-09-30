// Reference answer for drills/2/math/dot-product/implement-1.
import type { Answer } from '@harness/drill';
import { MathUtils, Vector3 } from 'three';

export function canSee(eye: Vector3, facing: Vector3, target: Vector3, halfAngle: number, range: number): Answer<boolean> {
  const toTarget = target.clone().sub(eye);
  if (toTarget.lengthSq() > range * range) return false;
  const agreement = facing.clone().normalize().dot(toTarget.normalize());
  return agreement >= Math.cos(MathUtils.degToRad(halfAngle));
}
