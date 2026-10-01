import type { Vector3 } from 'three';

type Scanner = (facing: Vector3, toward: Vector3, halfAngle: number) => boolean;

// Replace this placeholder with a short assertion about scanner behavior.
export function checkScanner(_canSee: Scanner): void {
  throw new Error('Write the regression check in check.ts');
}
