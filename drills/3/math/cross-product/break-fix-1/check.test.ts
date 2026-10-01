import { describe, it } from 'vitest';
import { signedSide } from './drill';
import { checkSide } from './check';

describe('regression check', () => {
  it('rejects reversed winding', () => checkSide(signedSide));
});
