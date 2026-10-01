import { Matrix4, Vector3 } from 'three';
export function savedPosition(matrix: Matrix4): Vector3 {
  return new Vector3(matrix.elements[3], matrix.elements[7], matrix.elements[11]);
}
