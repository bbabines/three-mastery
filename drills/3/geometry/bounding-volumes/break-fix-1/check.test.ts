import { describe, it } from 'vitest';
import { deformAndBound } from './drill';
import { checkBoundingVolumes } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkBoundingVolumes(deformAndBound));
});
