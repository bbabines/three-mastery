import { expectNumber } from '@harness/check';
import { describe, it } from 'vitest';
import { nextDpr } from './drill';
describe('nextDpr', () => {
  it('holds steady within the dead band and reacts beyond it', () => {
    let dpr = 1.5;
    for (const ms of [16.2, 17.1, 16.5, 18.4, 15.8]) {
      dpr = nextDpr(dpr, ms);
      expectNumber(dpr, 1.5);
    }
    expectNumber(nextDpr(dpr, 22), 1.25);
    expectNumber(nextDpr(dpr, 12), 1.75);
    expectNumber(nextDpr(1, 30), 1);
    expectNumber(nextDpr(2, 10), 2);
  });
});
