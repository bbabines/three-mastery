import { expect } from 'vitest';
import { Texture } from 'three';
import type { TextureLoader } from './drill';

type Load = (urls: string[], loader: TextureLoader) => Promise<Texture[]>;

export async function checkSwatchReuse(loadSwatches: Load): Promise<void> {
  let calls = 0;
  const loader: TextureLoader = { loadAsync: async () => { calls += 1; return new Texture(); } };
  const result = await loadSwatches(['repeat.ktx2', 'repeat.ktx2'], loader);
  expect(calls, 'one URL should transcode only once').toBe(1);
  expect(result[0]).toBe(result[1]);
}
