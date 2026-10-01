import { describe, it } from 'vitest';
import { hitNormalWorld } from './drill';
import { checkIntersectionAnatomy } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkIntersectionAnatomy(hitNormalWorld));
});
