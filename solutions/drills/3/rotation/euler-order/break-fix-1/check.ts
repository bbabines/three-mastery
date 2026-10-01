import { expect } from 'vitest';
import { Object3D, Quaternion } from 'three';

type Orientation = (yaw: number, pitch: number, roll: number) => Quaternion;

export function checkEuler(cameraOrientation: Orientation): void {
  const camera = new Object3D();
  camera.rotation.order = 'YXZ';
  camera.rotation.set(0.8, 0.6, -0.3);
  expect(cameraOrientation(0.6, 0.8, -0.3).angleTo(camera.quaternion)).toBeLessThan(1e-5);
}
