import { describe, it } from 'vitest';
import { selectableBoxHit } from './drill';
import { checkFiltering } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkFiltering(selectableBoxHit));
});
