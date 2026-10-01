import { describe, it } from 'vitest';
import { maskedTarget } from './drill';
import { checkStencil } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkStencil(maskedTarget));
});
