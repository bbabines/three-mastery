import { describe, it } from 'vitest';
import { primitiveMeshes } from './drill';
import { checkPrimitives } from './check';

describe('regression check', () => {
  it('rejects a one-level material audit', () => checkPrimitives(primitiveMeshes));
});
