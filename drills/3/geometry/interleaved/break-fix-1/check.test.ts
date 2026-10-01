import { describe, it } from 'vitest';
import { moveInterleaved } from './drill';
import { checkInterleaved } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkInterleaved(moveInterleaved));
});
