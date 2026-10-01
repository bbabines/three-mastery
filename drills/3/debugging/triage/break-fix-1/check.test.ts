import { describe, it } from 'vitest';
import { firstBlocker } from './drill';
import { checkTriage } from './check';

describe('regression check', () => {
  it('rejects an appearance-first diagnosis', () => checkTriage(firstBlocker));
});
