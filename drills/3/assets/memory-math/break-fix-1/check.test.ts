import { describe, it } from 'vitest';
import { textureBytes } from './drill';
import { checkMipBudget } from './check';

describe('regression check', () => {
  it('rejects an estimate that leaves out mipmaps', () => checkMipBudget(textureBytes));
});
