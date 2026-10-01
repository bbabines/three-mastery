import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { frameSaving } from './drill';

describe('frameSaving', () => {
it('reports improvement and regression with the baseline as denominator', () => {
    const improved = answered(frameSaving(20,15)); expect(improved.ms).toBe(5); expect(improved.percent).toBe(25);
    const regressed = answered(frameSaving(10,12)); expect(regressed.ms).toBe(-2); expect(regressed.percent).toBe(-20);
  });
});
