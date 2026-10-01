import type { Mesh, Object3D } from 'three';

type Collect = (part: Object3D) => Mesh[];

export function checkPrimitives(_collect: Collect): void {
  throw new Error('Write the regression check in check.ts');
}
