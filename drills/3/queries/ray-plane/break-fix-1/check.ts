import type { planeHit } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkRayPlane(_subject: typeof planeHit): void {
  throw new Error('Write the regression check in check.ts');
}
