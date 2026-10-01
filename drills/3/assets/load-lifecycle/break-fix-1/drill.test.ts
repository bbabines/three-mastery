import { describe, expect, it } from 'vitest';
import { preloadLikely } from './drill';

describe('preloadLikely', () => {
  const items = [{ url: 'front', likely: true }, { url: 'rear', likely: false }, { url: 'side', likely: true }];
  it('fetches only likely-next assets and preserves their results', async () => {
    const requested: string[] = [];
    const result = await preloadLikely(items, async (url) => { requested.push(url); return `${url} loaded`; });
    expect(requested).toEqual(['front', 'side']);
    expect(result).toEqual(['front loaded', 'side loaded']);
  });
  it('rejects when a likely asset fails instead of claiming it is ready', async () => {
    await expect(preloadLikely(items, async (url) => {
      if (url === 'side') throw new Error('network failed');
      return url;
    })).rejects.toThrow('network failed');
  });
});
