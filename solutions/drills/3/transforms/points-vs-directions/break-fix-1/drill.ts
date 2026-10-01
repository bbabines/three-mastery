import { Matrix3, Object3D, Vector3 } from 'three';

export function worldVelocity(part: Object3D, localVelocity: Vector3): Vector3 {
  part.updateWorldMatrix(true, false);
  return localVelocity.clone().applyMatrix3(new Matrix3().setFromMatrix4(part.matrixWorld));
}
