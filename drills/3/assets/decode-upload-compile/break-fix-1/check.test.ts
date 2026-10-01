import { describe, it } from 'vitest';
import { prepareVariant } from './drill';
import { checkWarmup } from './check';

describe('regression check', () => {
  it('rejects compile-only variant preparation', async () => checkWarmup(prepareVariant));
});
