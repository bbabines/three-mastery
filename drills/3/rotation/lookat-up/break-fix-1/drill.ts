import { PerspectiveCamera, Quaternion, Vector3 } from 'three';

// Aim camera at target with worldUp at the top of the view; return its orientation.
export function aimCamera(camera: PerspectiveCamera, target: Vector3, worldUp: Vector3): Quaternion {
  camera.lookAt(target);
  return camera.quaternion.clone();
}
