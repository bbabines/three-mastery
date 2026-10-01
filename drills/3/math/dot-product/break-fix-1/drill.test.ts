import { expectUnchanged } from '@harness/check';
import { Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { canSee } from './drill';

describe('canSee', () => {
  it('rejects a target outside the cone even when the vectors are long', () => {
    const facing = new Vector3(0, 0, 4);
    const toward = new Vector3(4, 0, 1);
    expect(canSee(facing, toward, Math.PI / 3)).toBe(facing.angleTo(toward) <= Math.PI / 3);
  });

  it('accepts a target inside the cone even when one vector is short', () => {
    const facing = new Vector3(0, 0, 0.2);
    const toward = new Vector3(0.1, 0, 1);
    expect(canSee(facing, toward, Math.PI / 4)).toBe(facing.angleTo(toward) <= Math.PI / 4);
  });

  it('uses the angle for slanted targets near either edge', () => {
    const facing = new Vector3(1, 1, 0).multiplyScalar(4);
    for (const toward of [new Vector3(2, 1, 0), new Vector3(1, -2, 0)]) {
      expect(canSee(facing, toward, 0.5)).toBe(facing.angleTo(toward) <= 0.5);
    }
  });

  it('rejects a zero direction', () => {
    expect(canSee(new Vector3(), new Vector3(0, 0, 1), 0.5)).toBe(false);
    expect(canSee(new Vector3(0, 0, 1), new Vector3(), 0.5)).toBe(false);
  });

  it('does not change the directions', () => {
    const facing = new Vector3(0, 0, 4);
    const toward = new Vector3(1, 0, 2);
    canSee(facing, toward, 0.5);
    expectUnchanged(facing, new Vector3(0, 0, 4), 'facing');
    expectUnchanged(toward, new Vector3(1, 0, 2), 'toward');
  });
});
