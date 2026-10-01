import { describe, it } from 'vitest';
import { withHidden } from './drill';
import { checkIsolation } from './check';

describe('regression check', () => {
  it('rejects isolation that leaves a part hidden', () => checkIsolation(withHidden));
});
