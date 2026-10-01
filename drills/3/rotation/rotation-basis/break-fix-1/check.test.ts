import { describe, it } from 'vitest';
import { forwardFromEuler } from './drill';
import { checkBasis } from './check';

describe('regression check', () => {
  it('rejects angles used as a direction', () => checkBasis(forwardFromEuler));
});
