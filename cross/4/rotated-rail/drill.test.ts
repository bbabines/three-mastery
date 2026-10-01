import { expectUnchanged, expectVector } from '@harness/check';
import { Object3D, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { railMotion } from './drill';

describe('rotated rail', () => {
  it('projects onto the rail after parent and local turns', () => {
    const parent = new Object3D();
    parent.rotation.y = 0.7;
    const rail = new Object3D();
    rail.rotation.z = 0.4;
    parent.add(rail);
    const motion = new Vector3(2, -1, 3);
    const result = railMotion(motion, rail);
    // The answer must refresh the changed parent; a renderer has not done that yet.
    rail.updateWorldMatrix(true, false);
    const axis = new Vector3(1, 0, 0).transformDirection(rail.matrixWorld);
    const expected = motion.clone().projectOnVector(axis);
    expectVector(result, expected);
    expectUnchanged(motion, new Vector3(2, -1, 3), 'motion');
    expect(Math.abs(motion.clone().sub(result!).dot(axis))).toBeLessThan(1e-6);
  });
  it('also works for a rail with no turn', () => {
    expectVector(railMotion(new Vector3(2, 3, 4), new Object3D()), new Vector3(2, 0, 0));
  });
});
