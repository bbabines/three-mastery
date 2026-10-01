import type { hitNormalWorld } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkIntersectionAnatomy(_subject: typeof hitNormalWorld): void {
  throw new Error('Write the regression check in check.ts');
}
