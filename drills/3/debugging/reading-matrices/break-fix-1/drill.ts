// Matrix inspection: diagnose a misleading sign check.
import type { Matrix4 } from 'three';

export function isMirrored(matrix: Matrix4): boolean {
  return matrix.elements[0] < 0;
}
