import { describe, it } from 'vitest';
import { drawCount } from './drill';
import { checkDrawCount } from './check';

describe('regression check', () => {
  it('rejects a counter that misses indexed and instanced draws', () => checkDrawCount(drawCount));
});
