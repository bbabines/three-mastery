import type { Vector3 } from 'three';
import type { WallMotion } from './drill';

type Bounce = (incoming: Vector3, normal: Vector3) => WallMotion;

export function checkWall(_slideAndBounce: Bounce): void {
  throw new Error('Write the regression check in check.ts');
}
