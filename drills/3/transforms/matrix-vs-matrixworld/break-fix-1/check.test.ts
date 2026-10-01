import { describe, it } from 'vitest';
import { moveWithoutJump } from './drill';
import { checkReparent } from './check';

describe('regression check', () => {
  it('rejects a world-transform jump', () => checkReparent(moveWithoutJump));
});
