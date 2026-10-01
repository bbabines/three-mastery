import { expectNumber } from '@harness/check';
import { describe, it } from 'vitest';
import { pixelRatioFor } from './drill';

describe('pixelRatioFor', () => {
  it('caps dense monitors while retaining smaller device ratios', () => {
    for (const [device, cap] of [[1, 2], [1.5, 2], [2.5, 2], [3, 1.5], [4, 2]]) {
      expectNumber(pixelRatioFor(device, cap), Math.min(device, cap));
    }
  });

  it('uses one for missing or invalid device ratios', () => {
    for (const device of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expectNumber(pixelRatioFor(device, 2), 1);
    }
  });
});
