import { Vector3 } from 'three';

// True when the lerped position is within tolerance world units of destination.
export function hasArrived(start: Vector3, destination: Vector3, progress: number, tolerance: number): boolean {
  const position = start.clone().lerp(destination, progress);
  return position.equals(destination);
}
