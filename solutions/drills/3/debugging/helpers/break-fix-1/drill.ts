import { ArrowHelper, Object3D, Vector3 } from 'three';

export function worldArrow(parent: Object3D, origin: Vector3, direction: Vector3): ArrowHelper {
  parent.updateWorldMatrix(true, false);
  const localOrigin = parent.worldToLocal(origin.clone());
  const localDirection = direction.clone().transformDirection(parent.matrixWorld.clone().invert());
  const helper = new ArrowHelper(localDirection, localOrigin, direction.length(), 0x3b82f6);
  parent.add(helper);
  return helper;
}
