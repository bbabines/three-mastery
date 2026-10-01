import { describe, it } from 'vitest';
import { boundsInWorld } from './drill';
import { checkWorldBounds } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkWorldBounds(boundsInWorld));
});
