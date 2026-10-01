import { Euler, Quaternion } from 'three';

export function cameraOrientation(yaw: number, pitch: number, roll: number): Quaternion {
  return new Quaternion().setFromEuler(new Euler(pitch, yaw, roll, 'YXZ'));
}
