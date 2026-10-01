import { Object3D, Vector3 } from 'three';

export function lampPosition(part: Object3D): Vector3 {
  return part.getWorldPosition(new Vector3());
}
