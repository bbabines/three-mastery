import { Euler, Quaternion } from 'three';
export function cameraTurn(yaw: number, pitch: number): Quaternion {
  return new Quaternion().setFromEuler(new Euler(pitch, yaw, 0, 'YXZ'));
}
