import { describe, it } from 'vitest';
import { passCost } from './drill';
import { checkMultiPass } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkMultiPass(passCost));
});
