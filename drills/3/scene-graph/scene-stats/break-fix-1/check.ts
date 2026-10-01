import type { visibleLayerMeshes } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkSceneStats(_subject: typeof visibleLayerMeshes): void {
  throw new Error('Write the regression check in check.ts');
}
