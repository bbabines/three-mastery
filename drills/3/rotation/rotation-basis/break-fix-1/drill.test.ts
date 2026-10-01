import { expectVector } from '@harness/check';
import { Euler, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { forwardFromEuler } from './drill';

describe('forwardFromEuler', () => {
  it('returns +Z for no rotation', () => {
    expectVector(forwardFromEuler(new Euler()), new Vector3(0, 0, 1));
  });

  it('returns the rotated local +Z for combined rotations', () => {
    for (const angles of [new Euler(0.3, 0.7, -0.2, 'YXZ'), new Euler(-0.5, -1.1, 0.4, 'XYZ')]) {
      const actual = forwardFromEuler(angles);
      expectVector(actual, new Vector3(0, 0, 1).applyEuler(angles));
      expect(actual.length()).toBeCloseTo(1);
    }
  });

  it('does not change the Euler angles', () => {
    const angles = new Euler(0.3, 0.7, -0.2, 'YXZ');
    const before = angles.clone();
    forwardFromEuler(angles);
    expect([angles.x, angles.y, angles.z, angles.order]).toEqual([before.x, before.y, before.z, before.order]);
  });
});
