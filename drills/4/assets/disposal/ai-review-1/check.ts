import type { MeshStandardMaterial } from 'three';

type Retire = (oldMaterial: MeshStandardMaterial, nextMaterial: MeshStandardMaterial) => void;

export function checkSharedMap(_retire: Retire): void {
  throw new Error('Write the regression check in check.ts');
}
