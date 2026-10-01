import type { boundsInWorld } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkWorldBounds(_subject: typeof boundsInWorld): void {
  throw new Error('Write the regression check in check.ts');
}
