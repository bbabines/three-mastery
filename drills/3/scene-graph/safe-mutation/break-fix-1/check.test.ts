import { describe, it } from 'vitest';
import { clearMarked } from './drill';
import { checkSafeMutation } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkSafeMutation(clearMarked));
});
