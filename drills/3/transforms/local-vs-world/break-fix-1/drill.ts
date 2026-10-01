import { Object3D, Vector3 } from 'three';

// Return part's world-space position without changing its local position.
export function lampPosition(part: Object3D): Vector3 {
  return part.position.clone();
}
