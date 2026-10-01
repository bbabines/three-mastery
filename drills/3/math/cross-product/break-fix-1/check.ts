import type { Vector3 } from 'three';

type Side = (a: Vector3, b: Vector3, c: Vector3, probe: Vector3) => number;

export function checkSide(_signedSide: Side): void {
  throw new Error('Write the regression check in check.ts');
}
