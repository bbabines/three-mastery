import { expectUnchanged, expectVector } from '@harness/check';
import { describe, it } from 'vitest';
import { Vector3 } from 'three';
import { slideOnWall } from './drill';

describe('slideOnWall', () => {
  it('slides along an angled wall without changing caller-owned vectors', () => {
    const velocity = new Vector3(3, -1, 4);
    const normal = new Vector3(2, 1, -3);
    const beforeVelocity = velocity.clone();
    const beforeNormal = normal.clone();
    const actual = slideOnWall(velocity, normal);
    expectVector(actual, beforeVelocity.clone().projectOnPlane(beforeNormal), 'wall slide');
    expectUnchanged(velocity, beforeVelocity, 'velocity');
    expectUnchanged(normal, beforeNormal, 'wall normal');
  });
});
