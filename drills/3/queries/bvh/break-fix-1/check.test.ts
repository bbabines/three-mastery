import { describe, it } from 'vitest';
import { candidateLeaves } from './drill';
import { checkBvh } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkBvh(candidateLeaves));
});
