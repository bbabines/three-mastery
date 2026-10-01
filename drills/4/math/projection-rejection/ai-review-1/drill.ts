// Generated proposal: review the behavior and ownership of slideOnWall.
import { Vector3 } from 'three';

export function slideOnWall(velocity: Vector3, wallNormal: Vector3): Vector3 {
  return velocity.projectOnPlane(wallNormal);
}
