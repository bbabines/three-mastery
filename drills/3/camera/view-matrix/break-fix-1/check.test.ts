import { describe, it } from 'vitest';
import { worldToView } from './drill';
import { checkViewMatrix } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkViewMatrix(worldToView));
});
