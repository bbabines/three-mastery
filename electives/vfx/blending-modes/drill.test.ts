import { answered } from '@harness/check';
import { Color } from 'three';
import { describe, expect, it } from 'vitest';
import { composite } from './drill';

describe('composite', () => {
  it('separates replacement from light addition and preserves inputs', () => {
    const background = new Color().setRGB(0.2, 0.3, 0.4), source = new Color().setRGB(0.8, 0.5, 0.1);
    const alpha = answered(composite(background, source, 0.5, 'alpha'));
    const additive = answered(composite(background, source, 0.5, 'additive'));
    expect(alpha.r).toBeCloseTo(0.5); expect(alpha.g).toBeCloseTo(0.4); expect(alpha.b).toBeCloseTo(0.25);
    expect(additive.r).toBeCloseTo(0.6); expect(additive.g).toBeCloseTo(0.55); expect(additive.b).toBeCloseTo(0.45);
    expect(background.r).toBeCloseTo(0.2); expect(source.r).toBeCloseTo(0.8);
  });
});
