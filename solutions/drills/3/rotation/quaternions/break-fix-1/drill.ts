import { Euler, Quaternion } from 'three';

export function blendOrientation(from: Euler, to: Euler, t: number): Quaternion {
  const a = new Quaternion().setFromEuler(from);
  const b = new Quaternion().setFromEuler(to);
  return new Quaternion().slerpQuaternions(a, b, t);
}
