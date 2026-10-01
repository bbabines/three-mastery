import type { Vector3 } from 'three';

type Finder = (center: Vector3, parts: Vector3[], radius: number) => number;

// Replace this placeholder with a short assertion about the nearest part.
export function checkNearest(_nearestWithin: Finder): void {
  throw new Error('Write the regression check in check.ts');
}
