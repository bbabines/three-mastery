import { Object3D, Vector3 } from 'three';

// Move part, then report a part-local anchor in world space in the same update.
export function movedAnchor(part: Object3D, newPosition: Vector3, anchorLocal: Vector3): Vector3 {
  part.position.copy(newPosition);
  return anchorLocal.clone().applyMatrix4(part.matrixWorld);
}
