import type { pointerRay } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkRayFromPointer(_subject: typeof pointerRay): void {
  throw new Error('Write the regression check in check.ts');
}
