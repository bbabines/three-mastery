import { Matrix3, Matrix4 } from 'three';
export function worldNormalMatrix(model: Matrix4, view: Matrix4): Matrix3 {
  return new Matrix3().getNormalMatrix(new Matrix4().multiplyMatrices(view, model));
}
