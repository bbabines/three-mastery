// The scanner sees a target when its direction is within halfAngle of facing.
// Both vectors can have any length. A zero vector points nowhere.
import { Vector3 } from 'three';

export function canSee(facing: Vector3, toward: Vector3, halfAngle: number): boolean {
  if (facing.lengthSq() === 0 || toward.lengthSq() === 0) return false;
  return facing.dot(toward) >= Math.cos(halfAngle);
}
