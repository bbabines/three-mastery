import { describe, it } from 'vitest';
import { variant } from './drill';
import { checkCloneSemantics } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkCloneSemantics(variant));
});
