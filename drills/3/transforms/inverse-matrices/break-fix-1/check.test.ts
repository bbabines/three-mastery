import { describe, it } from 'vitest';
import { localHit } from './drill';
import { checkInverse } from './check';

describe('regression check', () => {
  it('rejects a transpose used as an inverse', () => checkInverse(localHit));
});
