import { MathUtils } from 'three';
import { describe, expect, it } from 'vitest';
import { textureSize } from './drill';

describe('textureSize', () => {
  it('chooses no more texels than the display can show or the source contains', () => {
    for (const [css, dpr, source] of [[120, 2, 4096], [300, 1, 4096], [900, 2, 2048], [2000, 2, 2048]]) {
      expect(textureSize(css, dpr, source)).toBe(Math.min(source, MathUtils.ceilPowerOfTwo(css * dpr)));
    }
  });
});
