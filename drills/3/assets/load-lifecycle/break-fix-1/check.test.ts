import { describe, it } from 'vitest';
import { preloadLikely } from './drill';
import { checkPreloadFailure } from './check';

describe('regression check', () => {
  it('rejects a preload that hides failed downloads', async () => checkPreloadFailure(preloadLikely));
});
