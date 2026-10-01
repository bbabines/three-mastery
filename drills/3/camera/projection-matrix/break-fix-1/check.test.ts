import { describe, it } from 'vitest';
import { viewportLens } from './drill';
import { checkProjectionMatrix } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkProjectionMatrix(viewportLens));
});
