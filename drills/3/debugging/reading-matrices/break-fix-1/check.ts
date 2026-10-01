import type { Matrix4 } from 'three';

type Classify = (matrix: Matrix4) => boolean;

export function checkMirror(_isMirrored: Classify): void {
  throw new Error('Write the regression check in check.ts');
}
