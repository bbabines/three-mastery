import { Vector3 } from 'three';

// Rotate point about hinge and axis by angle radians, returning a world-space point.
export function turnAtHinge(point: Vector3, hinge: Vector3, axis: Vector3, angle: number): Vector3 {
  return point.clone().applyAxisAngle(axis.clone().normalize(), angle);
}
