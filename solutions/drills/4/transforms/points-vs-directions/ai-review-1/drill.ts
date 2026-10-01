import { Object3D, Vector3 } from 'three';
export function worldDirection(object: Object3D, local: Vector3): Vector3 {
  object.updateMatrixWorld(true);
  return local.clone().transformDirection(object.matrixWorld);
}
