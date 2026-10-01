import { describe, it } from 'vitest';
import { applyPixelBudget } from './drill';
import { checkPhoneBudget } from './check';

describe('regression check', () => {
  it('rejects an uncapped high-density drawing buffer', () => checkPhoneBudget(applyPixelBudget));
});
