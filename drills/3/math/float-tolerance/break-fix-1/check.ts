import type { Vector3 } from 'three';

type Arrival = (start: Vector3, destination: Vector3, progress: number, tolerance: number) => boolean;

export function checkArrival(_hasArrived: Arrival): void {
  throw new Error('Write the regression check in check.ts');
}
