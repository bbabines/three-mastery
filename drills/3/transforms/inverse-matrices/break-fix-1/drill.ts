import { Object3D, Vector3 } from 'three';

// Return worldHit measured in part's local space.
export function localHit(part: Object3D, worldHit: Vector3): Vector3 {
  part.updateWorldMatrix(true, false);
  return worldHit.clone().applyMatrix4(part.matrixWorld.clone().transpose());
}
