import { Matrix3, Object3D, Vector3 } from 'three';

export interface WorldSurface { normal: Vector3; mirrored: boolean }

export function worldSurface(part: Object3D, localNormal: Vector3): WorldSurface {
  part.updateWorldMatrix(true, false);
  return {
    normal: localNormal.clone().applyNormalMatrix(new Matrix3().getNormalMatrix(part.matrixWorld)),
    mirrored: part.matrixWorld.determinant() < 0,
  };
}
