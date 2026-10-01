import { expect } from 'vitest';
import { Quaternion, Vector3 } from 'three';

type Turn = (point: Vector3, hinge: Vector3, axis: Vector3, angle: number) => Vector3;

export function checkHinge(turnAtHinge: Turn): void {
  const point = new Vector3(4, -1, 2), hinge = new Vector3(3, -2, 1), axis = new Vector3(1, 2, 0);
  const q = new Quaternion().setFromAxisAngle(axis.clone().normalize(), 0.6);
  const expected = hinge.clone().add(point.clone().sub(hinge).applyQuaternion(q));
  expect(turnAtHinge(point, hinge, axis, 0.6).distanceTo(expected)).toBeLessThan(1e-5);
}
