import { Matrix4, Vector3 } from 'three';
export function savedPosition(matrix: Matrix4): Vector3 {
  return new Vector3().setFromMatrixPosition(matrix);
}
