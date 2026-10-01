import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { framePressure } from './drill';

describe('framePressure', () => {
it('uses the slower overlapping side and reports budget pressure', () => {
    const slowGpu = answered(framePressure(5,20,60)); expect(slowGpu.frameMs).toBe(20); expect(slowGpu.overBudgetMs).toBeCloseTo(20-1000/60);
    const slowCpu = answered(framePressure(12,4,60)); expect(slowCpu.frameMs).toBe(12); expect(slowCpu.overBudgetMs).toBe(0);
  });
});
