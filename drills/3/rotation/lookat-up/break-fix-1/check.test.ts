import { describe, it } from 'vitest';
import { aimCamera } from './drill';
import { checkUp } from './check';

describe('regression check', () => {
  it('rejects a camera aimed with default up', () => checkUp(aimCamera));
});
