import type { Mesh } from 'three';

type Inspect = (mesh: Mesh) => boolean;

export function checkDegenerate(_canAppear: Inspect): void {
  throw new Error('Write the regression check in check.ts');
}
