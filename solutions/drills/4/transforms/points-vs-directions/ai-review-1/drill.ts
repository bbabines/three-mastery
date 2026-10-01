import { Object3D, Vector3 } from 'three';
export function worldDirection(object: Object3D, local: Vector3): Vector3 {
  object.updateWorldMatrix(true, false);
  return local.clone().transformDirection(object.matrixWorld);
}
