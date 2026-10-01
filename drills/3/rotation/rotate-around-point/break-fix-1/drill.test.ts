import { expectUnchanged, expectVector } from '@harness/check';
import { Quaternion, Vector3 } from 'three';
import { describe, it } from 'vitest';
import { turnAtHinge } from './drill';

function expected(point: Vector3, hinge: Vector3, axis: Vector3, angle: number) {
  const q = new Quaternion().setFromAxisAngle(axis.clone().normalize(), angle);
  return hinge.clone().add(point.clone().sub(hinge).applyQuaternion(q));
}

describe('turnAtHinge', () => {
  it('turns about a hinge away from the origin', () => {
    const point = new Vector3(3, 1, 0);
    const hinge = new Vector3(2, 1, 0);
    const axis = new Vector3(0, 2, 0);
    expectVector(turnAtHinge(point, hinge, axis, Math.PI / 2), expected(point, hinge, axis, Math.PI / 2));
  });

  it('works around a tilted axis and a translated hinge', () => {
    const point = new Vector3(-2, 4, 3);
    const hinge = new Vector3(-3, 2, 2);
    const axis = new Vector3(1, 2, 1);
    expectVector(turnAtHinge(point, hinge, axis, -0.7), expected(point, hinge, axis, -0.7));
  });

  it('does not change the point, hinge, or axis', () => {
    const point = new Vector3(3, 1, 0), hinge = new Vector3(2, 1, 0), axis = new Vector3(0, 2, 0);
    turnAtHinge(point, hinge, axis, 0.8);
    expectUnchanged(point, new Vector3(3, 1, 0), 'point');
    expectUnchanged(hinge, new Vector3(2, 1, 0), 'hinge');
    expectUnchanged(axis, new Vector3(0, 2, 0), 'axis');
  });
});
