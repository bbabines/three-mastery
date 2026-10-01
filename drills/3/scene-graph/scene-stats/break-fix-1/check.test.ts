import { describe, it } from 'vitest';
import { visibleLayerMeshes } from './drill';
import { checkSceneStats } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkSceneStats(visibleLayerMeshes));
});
