import { Object3D, Vector3 } from 'three';

export interface WorldSurface { normal: Vector3; mirrored: boolean }

// Return a unit world normal and whether the part's world transform is mirrored.
export function worldSurface(part: Object3D, localNormal: Vector3): WorldSurface {
  part.updateWorldMatrix(true, false);
  return {
    normal: localNormal.clone().transformDirection(part.matrixWorld),
    mirrored: part.matrixWorld.determinant() < 0,
  };
}
