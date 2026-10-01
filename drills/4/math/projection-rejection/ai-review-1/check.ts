import type { Vector3 } from 'three';

type Slide = (velocity: Vector3, wallNormal: Vector3) => Vector3;

export function checkWallSlide(_slide: Slide): void {
  throw new Error('Write the regression check in check.ts');
}
