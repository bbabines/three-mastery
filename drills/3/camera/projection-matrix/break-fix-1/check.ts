import type { viewportLens } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkProjectionMatrix(_subject: typeof viewportLens): void {
  throw new Error('Write the regression check in check.ts');
}
