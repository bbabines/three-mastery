import { PerspectiveCamera, Quaternion, Vector3 } from 'three';

export function aimCamera(camera: PerspectiveCamera, target: Vector3, worldUp: Vector3): Quaternion {
  camera.up.copy(worldUp);
  camera.lookAt(target);
  return camera.quaternion.clone();
}
