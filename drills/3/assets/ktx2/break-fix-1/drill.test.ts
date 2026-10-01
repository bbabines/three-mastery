import { Texture } from 'three';
import { describe, expect, it } from 'vitest';
import { loadSwatches } from './drill';

describe('loadSwatches', () => {
  it('transcodes each URL once and reuses the texture for repeated swatches', async () => {
    const calls: string[] = [];
    const loader = { loadAsync: async (url: string) => { calls.push(url); return new Texture(); } };
    const textures = await loadSwatches(['blue.ktx2', 'red.ktx2', 'blue.ktx2'], loader);
    expect(calls).toEqual(['blue.ktx2', 'red.ktx2']);
    expect(textures).toHaveLength(3);
    expect(textures[0]).toBe(textures[2]);
    expect(textures[0]).not.toBe(textures[1]);
  });
});
