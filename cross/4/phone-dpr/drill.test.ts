import { expectNumber } from '@harness/check';
import { describe, expect, it } from 'vitest';
import { budgetedDpr } from './drill';

describe('adaptive phone resolution', () => {
  it('caps physical pixels rather than CSS pixels', () => {
    const result = budgetedDpr(400,800,3,720000);
    expectNumber(result,Math.sqrt(720000/(400*800)));
    expect(400*800*result!*result!).toBeLessThanOrEqual(720001);
  });
  it('uses the device ratio below the cap and handles invalid sizes', () => {
    expectNumber(budgetedDpr(800,600,1.5,2000000),1.5);
    expectNumber(budgetedDpr(0,600,2,1000000),1);
  });
});
