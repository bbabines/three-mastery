import { describe, it } from 'vitest';
import { uvAtHit } from './drill';
import { checkRayTriangle } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkRayTriangle(uvAtHit));
});
