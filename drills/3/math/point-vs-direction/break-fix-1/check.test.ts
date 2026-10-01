import { describe, it } from 'vitest';
import { nearestWithin } from './drill';
import { checkNearest } from './check';

describe('regression check', () => {
  it('rejects origin-based distance', () => checkNearest(nearestWithin));
});
