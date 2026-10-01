import { Euler, Matrix4, Quaternion, Vector3 } from 'three';

export function forwardFromEuler(angles: Euler): Vector3 {
  const matrix = new Matrix4().makeRotationFromQuaternion(new Quaternion().setFromEuler(angles));
  const x = new Vector3(), y = new Vector3(), z = new Vector3();
  matrix.extractBasis(x, y, z);
  return z.normalize();
}
