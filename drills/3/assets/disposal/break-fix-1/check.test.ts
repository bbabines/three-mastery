import { describe, it } from 'vitest';
import { retireProduct } from './drill';
import { checkRetirement } from './check';

describe('regression check', () => {
  it('rejects removal without disposal', () => checkRetirement(retireProduct));
});
