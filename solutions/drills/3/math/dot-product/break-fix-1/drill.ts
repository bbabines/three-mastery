import { Vector3 } from 'three';

export function canSee(facing: Vector3, toward: Vector3, halfAngle: number): boolean {
  if (facing.lengthSq() === 0 || toward.lengthSq() === 0) return false;
  return facing.angleTo(toward) <= halfAngle;
}
