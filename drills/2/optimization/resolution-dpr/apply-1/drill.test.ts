import { expectNumber } from '@harness/check';
import { describe, it } from 'vitest';
import { ratioWhileOrbiting } from './drill';

describe('ratioWhileOrbiting', () => {
  it('uses one device pixel per CSS pixel during motion', () => {
    for (const device of [1, 1.5, 2.5, 4]) expectNumber(ratioWhileOrbiting(device, true, 2), 1);
  });
  it('restores the cap or device ratio after motion', () => {
    for (const [device, cap] of [[1, 2], [1.75, 2], [3, 2], [4, 1.5]]) {
      expectNumber(ratioWhileOrbiting(device, false, cap), Math.min(device, cap));
    }
    expectNumber(ratioWhileOrbiting(Number.NaN, false, 2), 1);
  });
});
