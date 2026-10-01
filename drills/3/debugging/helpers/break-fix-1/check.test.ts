import { describe, it } from 'vitest';
import { worldArrow } from './drill';
import { checkWorldRay } from './check';

describe('regression check', () => {
  it('rejects a ray helper parented in the wrong space', () => checkWorldRay(worldArrow));
});
