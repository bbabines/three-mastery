import { expectNumber } from '@harness/check';
import { describe, it } from 'vitest';
import { applyPixelBudget } from './drill';

describe('applyPixelBudget', () => {
  it('uses the device ratio until the two-pixel cap', () => {
    for (const device of [1, 1.25, 2, 2.5, 3.5]) {
      const calls: number[] = [];
      const chosen = applyPixelBudget({ setPixelRatio: (value) => calls.push(value) }, device);
      const expected = Math.min(device, 2);
      expectNumber(chosen, expected);
      expectNumber(calls[0], expected);
    }
  });
});
