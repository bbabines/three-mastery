import { describe, it } from 'vitest';
import { blendOrientation } from './drill';
import { checkBlend } from './check';

describe('regression check', () => {
  it('rejects the long Euler-number turn', () => checkBlend(blendOrientation));
});
