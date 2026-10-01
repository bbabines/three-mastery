import { describe, it } from 'vitest';
import { movedAnchor } from './drill';
import { checkAnchor } from './check';

describe('regression check', () => {
  it('rejects a stale world matrix', () => checkAnchor(movedAnchor));
});
