import { describe, it } from 'vitest';
import { pointerRay } from './drill';
import { checkRayFromPointer } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkRayFromPointer(pointerRay));
});
