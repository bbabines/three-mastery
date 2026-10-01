import type { Object3D, Vector3 } from 'three';

type Convert = (part: Object3D, worldHit: Vector3) => Vector3;

export function checkInverse(_localHit: Convert): void {
  throw new Error('Write the regression check in check.ts');
}
