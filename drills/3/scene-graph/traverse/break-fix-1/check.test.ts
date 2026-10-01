import { describe, it } from 'vitest';
import { visibleMeshCount } from './drill';
import { checkTraverse } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkTraverse(visibleMeshCount));
});
