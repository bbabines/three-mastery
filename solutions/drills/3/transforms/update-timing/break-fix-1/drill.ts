import { Object3D, Vector3 } from 'three';

export function movedAnchor(part: Object3D, newPosition: Vector3, anchorLocal: Vector3): Vector3 {
  part.position.copy(newPosition);
  part.updateWorldMatrix(true, false);
  return anchorLocal.clone().applyMatrix4(part.matrixWorld);
}
