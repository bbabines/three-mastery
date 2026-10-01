import type { visibleMeshCount } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkTraverse(_subject: typeof visibleMeshCount): void {
  throw new Error('Write the regression check in check.ts');
}
