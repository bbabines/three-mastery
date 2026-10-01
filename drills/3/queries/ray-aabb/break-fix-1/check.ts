import type { rotatedBoxHit } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkRayAabb(_subject: typeof rotatedBoxHit): void {
  throw new Error('Write the regression check in check.ts');
}
