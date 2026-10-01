import type { visibleAfterResize } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkFrustum(_subject: typeof visibleAfterResize): void {
  throw new Error('Write the regression check in check.ts');
}
