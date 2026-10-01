import { expect } from 'vitest';
import type { Candidate } from './drill';

type Preload = <T>(items: Candidate[], load: (url: string) => Promise<T>) => Promise<T[]>;

export async function checkPreloadFailure(preload: Preload): Promise<void> {
  const candidates = [{ url: 'expected', likely: true }, { url: 'later', likely: false }];
  await expect(preload(candidates, async () => { throw new Error('download failed'); }), 'failed likely variant').rejects.toThrow('download failed');
}
