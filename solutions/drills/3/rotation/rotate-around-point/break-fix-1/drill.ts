import { Vector3 } from 'three';

export function turnAtHinge(point: Vector3, hinge: Vector3, axis: Vector3, angle: number): Vector3 {
  return point.clone().sub(hinge).applyAxisAngle(axis.clone().normalize(), angle).add(hinge);
}
