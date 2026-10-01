import { Euler, Vector3 } from 'three';

// Return where local +Z points in world space after angles are applied.
export function forwardFromEuler(angles: Euler): Vector3 {
  return new Vector3(angles.x, angles.y, angles.z).normalize();
}
