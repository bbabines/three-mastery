import { describe, it } from 'vitest';
import { flipFrontFace } from './drill';
import { checkWindingOrder } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkWindingOrder(flipFrontFace));
});
