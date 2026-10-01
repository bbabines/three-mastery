import type { Answer } from '@harness/drill';
import { Matrix3, Object3D, Vector3 } from 'three';

export function markerNormal(localNormal: Vector3, mesh: Object3D): Answer<Vector3> {
  mesh.updateWorldMatrix(true, false);
  return localNormal.clone().applyMatrix3(new Matrix3().getNormalMatrix(mesh.matrixWorld)).normalize();
}
