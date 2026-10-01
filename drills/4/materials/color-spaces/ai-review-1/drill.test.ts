import { NoColorSpace, SRGBColorSpace, Texture } from 'three';
import { describe, expect, it } from 'vitest';
import { configureMaps } from './drill';
describe('configureMaps', () => {
  it('marks color and data images differently', () => {
    const color = new Texture(); const normal = new Texture();
    configureMaps(color, normal);
    expect(color.colorSpace).toBe(SRGBColorSpace);
    expect(normal.colorSpace).toBe(NoColorSpace);
  });
});
