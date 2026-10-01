import { describe, it } from 'vitest';
import { visibleAfterResize } from './drill';
import { checkFrustum } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkFrustum(visibleAfterResize));
});
