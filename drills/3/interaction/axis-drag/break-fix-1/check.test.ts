import { describe, it } from 'vitest';
import { railPosition } from './drill';
import { checkAxisDrag } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkAxisDrag(railPosition));
});
