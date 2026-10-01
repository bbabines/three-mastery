import { describe, it } from 'vitest';
import { turnAtHinge } from './drill';
import { checkHinge } from './check';

describe('regression check', () => {
  it('rejects a turn about the world origin', () => checkHinge(turnAtHinge));
});
