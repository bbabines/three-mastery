import type { Object3D, Vector3 } from 'three';
import type { WorldSurface } from './drill';

type Surface = (part: Object3D, localNormal: Vector3) => WorldSurface;

export function checkSurface(_worldSurface: Surface): void {
  throw new Error('Write the regression check in check.ts');
}
