import type { Object3D, Vector3 } from 'three';

type Locate = (part: Object3D) => Vector3;

export function checkLamp(_lampPosition: Locate): void {
  throw new Error('Write the regression check in check.ts');
}
