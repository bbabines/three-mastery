import { describe, it } from 'vitest';
import { dragPosition } from './drill';
import { checkDragOnPlane } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkDragOnPlane(dragPosition));
});
