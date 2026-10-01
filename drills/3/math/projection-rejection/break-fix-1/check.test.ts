import { describe, it } from 'vitest';
import { slideAndBounce } from './drill';
import { checkWall } from './check';

describe('regression check', () => {
  it('rejects a speed-changing bounce', () => checkWall(slideAndBounce));
});
