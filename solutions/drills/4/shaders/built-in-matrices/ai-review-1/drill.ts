import { Matrix3, Matrix4 } from 'three';
export function worldNormalMatrix(model: Matrix4, _view: Matrix4): Matrix3 {
  return new Matrix3().getNormalMatrix(model);
}
