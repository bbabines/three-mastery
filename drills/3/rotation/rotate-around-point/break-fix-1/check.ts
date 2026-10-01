import type { Vector3 } from 'three';

type Turn = (point: Vector3, hinge: Vector3, axis: Vector3, angle: number) => Vector3;

export function checkHinge(_turnAtHinge: Turn): void {
  throw new Error('Write the regression check in check.ts');
}
