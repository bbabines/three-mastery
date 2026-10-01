import { Object3D, Vector3 } from 'three';

export function moveWithoutJump(part: Object3D, newParent: Object3D): Vector3 {
  newParent.attach(part);
  return part.getWorldPosition(new Vector3());
}
