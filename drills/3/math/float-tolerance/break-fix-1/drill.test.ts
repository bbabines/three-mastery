import { expectUnchanged } from '@harness/check';
import { Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { hasArrived } from './drill';

function expected(start: Vector3, destination: Vector3, progress: number, tolerance: number) {
  return start.clone().lerp(destination, progress).distanceToSquared(destination) <= tolerance * tolerance;
}

describe('hasArrived', () => {
  it('turns on when a part enters the destination radius', () => {
    const start = new Vector3(0, 0, 0);
    const destination = new Vector3(4, 0, 0);
    for (const progress of [0.9, 0.96, 0.99, 1]) {
      expect(hasArrived(start, destination, progress, 0.2)).toBe(expected(start, destination, progress, 0.2));
    }
  });

  it('works when the path is translated away from the origin', () => {
    const start = new Vector3(20, -4, 7);
    const destination = new Vector3(22, -4, 8);
    for (const progress of [0.75, 0.95, 0.999999]) {
      expect(hasArrived(start, destination, progress, 0.15)).toBe(expected(start, destination, progress, 0.15));
    }
  });

  it('does not change the positions', () => {
    const start = new Vector3(1, 2, 3);
    const destination = new Vector3(4, 5, 6);
    hasArrived(start, destination, 0.95, 0.1);
    expectUnchanged(start, new Vector3(1, 2, 3), 'start');
    expectUnchanged(destination, new Vector3(4, 5, 6), 'destination');
  });
});
