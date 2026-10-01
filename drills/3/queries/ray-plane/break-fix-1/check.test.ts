import { describe, it } from 'vitest';
import { planeHit } from './drill';
import { checkRayPlane } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkRayPlane(planeHit));
});
