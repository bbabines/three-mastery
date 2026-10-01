import { expectNumber } from '@harness/check';
import { describe, it } from 'vitest';
import { textureBytes } from './drill';

describe('textureBytes', () => {
  it('counts every mip in a square and a rectangular image', () => {
    for (const [width, height] of [[2048, 2048], [16, 8], [9, 3], [2, 1]]) {
      let w = width; let h = height; let expected = 0;
      do {
        expected += w * h * 4;
        w = Math.max(1, Math.floor(w / 2));
        h = Math.max(1, Math.floor(h / 2));
      } while (w !== 1 || h !== 1);
      expected += 4;
      expectNumber(textureBytes(width, height), expected);
    }
  });
  it('does not add extra levels for a 1 × 1 texture', () => expectNumber(textureBytes(1, 1), 4));
});
