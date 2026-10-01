import type { Answer } from '@harness/drill';
import { Object3D, Quaternion, Vector3 } from 'three';

export function faceCamera(position: Vector3, cameraPosition: Vector3, lockY: boolean): Answer<Quaternion> {
  const plane = new Object3D();
  plane.position.copy(position);
  const target = cameraPosition.clone();
  if (lockY) target.y = position.y;
  plane.lookAt(target);
  return plane.quaternion.clone();
}
