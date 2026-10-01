import { describe, it } from 'vitest';
import { prepareGlass } from './drill';
import { checkBlending } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkBlending(prepareGlass));
});
