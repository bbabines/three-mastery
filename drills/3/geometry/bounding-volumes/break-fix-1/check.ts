import type { deformAndBound } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkBoundingVolumes(_subject: typeof deformAndBound): void {
  throw new Error('Write the regression check in check.ts');
}
