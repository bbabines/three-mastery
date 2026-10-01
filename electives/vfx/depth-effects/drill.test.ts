import { answered } from '@harness/check';
import { describe, expect, it } from 'vitest';
import { softFade } from './drill';

describe('softFade', () => {
  it('fades only within the world-space gap in front of the opaque surface', () => {
    expect(answered(softFade(5, 5, 1))).toBe(0);
    expect(answered(softFade(5, 4.75, 0.5))).toBeCloseTo(0.5);
    expect(answered(softFade(5, 4, 0.5))).toBe(1);
    expect(answered(softFade(5, 5.2, 0.5))).toBe(0);
  });
});
