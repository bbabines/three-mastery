import { answered, expectExact, expectNumber, expectUnchanged } from '@harness/check';
import { Plane, Vector3 } from 'three';
import { describe, it } from 'vitest';
import { inFront, mirrorImage } from './drill';

// A tilted mirror about 3 units across, so the cross product of its edges is nowhere near length 1.
const A = new Vector3(-1.5, 0.2, -2);
const B = new Vector3(1.5, 0.5, -2.4);
const C = new Vector3(1.2, 2.7, -2.6);
// three.js's own plane through the corners: its normal faces the side the corners are
// counter-clockwise from, and distanceToPoint is positive in front.
const MIRROR = new Plane().setFromCoplanarPoints(A, B, C);

const IN_FRONT = [new Vector3(0, 1.2, 1), new Vector3(2, 0.5, 3), new Vector3(-1, 2, -1)];
const BEHIND = [new Vector3(0.5, 1, -4), new Vector3(-2, 0, -5)];

const image = (point: Vector3) => answered(mirrorImage(A.clone(), B.clone(), C.clone(), point.clone()));

describe('inFront', () => {
  it('agrees with Plane for points on both sides', () => {
    for (const point of [...IN_FRONT, ...BEHIND]) {
      expectExact(inFront(A.clone(), B.clone(), C.clone(), point.clone()), MIRROR.distanceToPoint(point) > 0);
    }
  });
});

describe('mirrorImage', () => {
  it('puts the halfway point between a point and its image on the mirror', () => {
    for (const point of [...IN_FRONT, ...BEHIND]) {
      const halfway = point.clone().lerp(image(point), 0.5);
      expectNumber(MIRROR.distanceToPoint(halfway), 0);
    }
  });

  it('puts the image straight across the mirror', () => {
    for (const point of [...IN_FRONT, ...BEHIND]) {
      const across = image(point).sub(point);
      // Straight across means along the mirror's normal: crossing the two gives nothing.
      expectNumber(new Vector3().crossVectors(across, MIRROR.normal).length(), 0);
    }
  });

  it('puts the image as far behind the mirror as the point is in front', () => {
    for (const point of [...IN_FRONT, ...BEHIND]) {
      expectNumber(MIRROR.distanceToPoint(image(point)), -MIRROR.distanceToPoint(point));
    }
  });
});

describe('both', () => {
  it("don't change any of the vectors", () => {
    const [a, b, c, point] = [A.clone(), B.clone(), C.clone(), IN_FRONT[0].clone()];
    answered(inFront(a, b, c, point));
    answered(mirrorImage(a, b, c, point));
    expectUnchanged(a, A, 'a');
    expectUnchanged(b, B, 'b');
    expectUnchanged(c, C, 'c');
    expectUnchanged(point, IN_FRONT[0], 'point');
  });
});
