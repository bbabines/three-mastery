import { describe, it } from 'vitest';
import { textureSize } from './drill';
import { checkTextureBudget } from './check';

describe('regression check', () => {
  it('rejects a 4K texture for every thumbnail', () => checkTextureBudget(textureSize));
});
