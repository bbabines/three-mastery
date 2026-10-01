import type { Object3D } from 'three';

type Retire = (root: Object3D) => void;

export function checkRetirement(_retire: Retire): void {
  throw new Error('Write the regression check in check.ts');
}
