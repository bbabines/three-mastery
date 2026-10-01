import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { dampingFraction } from './drill';

describe('dampingFraction', () => {
it('composes across different frame lengths', () => {
    const one = answered(dampingFraction(4,1/30)); const half = answered(dampingFraction(4,1/60));
    expect(one).toBeCloseTo(1-(1-half)*(1-half));
    expectNumber(dampingFraction(4,0),0);
    expect(one).toBeGreaterThan(half);
  });
});
