import type { Object3D, Vector3 } from 'three';

type Reparent = (part: Object3D, newParent: Object3D) => Vector3;

export function checkReparent(_moveWithoutJump: Reparent): void {
  throw new Error('Write the regression check in check.ts');
}
