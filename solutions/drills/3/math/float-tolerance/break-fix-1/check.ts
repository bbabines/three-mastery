import { expect } from 'vitest';
import { Vector3 } from 'three';

type Arrival = (start: Vector3, destination: Vector3, progress: number, tolerance: number) => boolean;

export function checkArrival(hasArrived: Arrival): void {
  const start = new Vector3(-10, 2, 5);
  const destination = new Vector3(-7, 2, 5);
  const progress = 0.97;
  const tolerance = 0.1;
  const distance = start.clone().lerp(destination, progress).distanceTo(destination);
  expect(hasArrived(start, destination, progress, tolerance)).toBe(distance <= tolerance);
}
