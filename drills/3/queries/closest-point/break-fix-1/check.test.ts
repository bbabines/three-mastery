import { describe, it } from 'vitest';
import { segmentSnap } from './drill';
import { checkClosestPoint } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkClosestPoint(segmentSnap));
});
