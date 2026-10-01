import type { ArrowHelper, Object3D, Vector3 } from 'three';

type Draw = (parent: Object3D, origin: Vector3, direction: Vector3) => ArrowHelper;

export function checkWorldRay(_draw: Draw): void {
  throw new Error('Write the regression check in check.ts');
}
