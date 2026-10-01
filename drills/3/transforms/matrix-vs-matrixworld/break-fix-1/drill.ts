import { Object3D, Vector3 } from 'three';

// Reparent part while preserving its world transform, then return its world position.
export function moveWithoutJump(part: Object3D, newParent: Object3D): Vector3 {
  newParent.add(part);
  return part.getWorldPosition(new Vector3());
}
