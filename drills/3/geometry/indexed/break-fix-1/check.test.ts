import { describe, it } from 'vitest';
import { triangleAt } from './drill';
import { checkIndexed } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkIndexed(triangleAt));
});
