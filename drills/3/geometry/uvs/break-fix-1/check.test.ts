import { describe, it } from 'vitest';
import { tileFirstFace } from './drill';
import { checkUvs } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkUvs(tileFirstFace));
});
