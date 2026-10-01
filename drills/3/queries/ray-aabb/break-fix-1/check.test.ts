import { describe, it } from 'vitest';
import { rotatedBoxHit } from './drill';
import { checkRayAabb } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkRayAabb(rotatedBoxHit));
});
