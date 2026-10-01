import { Object3D, Quaternion } from 'three';
import { describe, expect, it } from 'vitest';
import { cameraOrientation } from './drill';

function expected(yaw: number, pitch: number, roll: number): Quaternion {
  const camera = new Object3D();
  camera.rotation.order = 'YXZ';
  camera.rotation.set(pitch, yaw, roll);
  return camera.quaternion.clone();
}

describe('cameraOrientation', () => {
  it('combines yaw and pitch in YXZ order', () => {
    for (const [yaw, pitch] of [[0.6, 0.4], [-0.8, 0.9], [1.1, -0.5]]) {
      expect(cameraOrientation(yaw, pitch, 0).angleTo(expected(yaw, pitch, 0))).toBeLessThan(1e-5);
    }
  });

  it('keeps the requested order with roll and a steep pitch', () => {
    const yaw = 0.7, pitch = Math.PI / 2 - 0.02, roll = -0.4;
    expect(cameraOrientation(yaw, pitch, roll).angleTo(expected(yaw, pitch, roll))).toBeLessThan(1e-5);
  });
});
