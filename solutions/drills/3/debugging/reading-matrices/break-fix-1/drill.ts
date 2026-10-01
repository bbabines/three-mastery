import type { Matrix4 } from 'three';

export function isMirrored(matrix: Matrix4): boolean {
  return matrix.determinant() < 0;
}
