import { Euler, Quaternion } from 'three';

// Camera orientation with yaw, pitch, roll in YXZ order. Angles are radians.
export function cameraOrientation(yaw: number, pitch: number, roll: number): Quaternion {
  return new Quaternion().setFromEuler(new Euler(pitch, yaw, roll, 'XYZ'));
}
