import { Vector3 } from 'three';

export function hasArrived(start: Vector3, destination: Vector3, progress: number, tolerance: number): boolean {
  const position = start.clone().lerp(destination, progress);
  return position.distanceToSquared(destination) <= tolerance * tolerance;
}
