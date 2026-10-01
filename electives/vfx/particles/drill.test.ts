import { answered } from '@harness/check';
import { describe, expect, it } from 'vitest';
import { emit } from './drill';

describe('emit', () => {
  it('uses elapsed seconds and carries fractional particles between unequal frames', () => {
    const first = answered(emit(10, 0.16, 0));
    expect(first.count).toBe(1); expect(first.carry).toBeCloseTo(0.6);
    const second = answered(emit(10, 0.16, first.carry));
    expect(second.count).toBe(2); expect(second.carry).toBeCloseTo(0.2);
    expect(answered(emit(10, 0.05, second.carry)).count).toBe(0);
  });
});
