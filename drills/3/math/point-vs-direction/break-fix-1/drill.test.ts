import { expectUnchanged } from '@harness/check';
import { Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { nearestWithin } from './drill';

function expected(center: Vector3, parts: Vector3[], radius: number) {
  const inRange = parts.map((point, index) => ({ index, distance: point.distanceToSquared(center) }))
    .filter(({ distance }) => distance <= radius * radius)
    .sort((a, b) => a.distance - b.distance);
  return inRange[0]?.index ?? -1;
}

describe('nearestWithin', () => {
  it('finds the closest part to a worker away from the origin', () => {
    const center = new Vector3(4, 1, -2);
    const parts = [new Vector3(4.4, 1, -2), new Vector3(0.1, 0, 0), new Vector3(4.2, 1.1, -2)];
    expect(nearestWithin(center, parts, 0.5)).toBe(expected(center, parts, 0.5));
  });

  it('returns -1 when no part is within reach', () => {
    const center = new Vector3(-5, 0, 3);
    const parts = [new Vector3(), new Vector3(-3, 0, 3)];
    expect(nearestWithin(center, parts, 0.4)).toBe(expected(center, parts, 0.4));
  });

  it('works after translating the whole arrangement', () => {
    const offset = new Vector3(12, -3, 7);
    const center = new Vector3(1, 2, 3).add(offset);
    const parts = [new Vector3(2, 2, 3).add(offset), new Vector3(1.1, 2, 3).add(offset)];
    expect(nearestWithin(center, parts, 0.5)).toBe(expected(center, parts, 0.5));
  });

  it('does not change the positions', () => {
    const center = new Vector3(4, 1, -2);
    const parts = [new Vector3(4.4, 1, -2), new Vector3(0.1, 0, 0)];
    const saved = parts.map((part) => part.clone());
    nearestWithin(center, parts, 0.5);
    expectUnchanged(center, new Vector3(4, 1, -2), 'center');
    parts.forEach((part, i) => expectUnchanged(part, saved[i], `part ${i}`));
  });
});
