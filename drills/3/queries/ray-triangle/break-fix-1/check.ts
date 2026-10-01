import type { uvAtHit } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkRayTriangle(_subject: typeof uvAtHit): void {
  throw new Error('Write the regression check in check.ts');
}
