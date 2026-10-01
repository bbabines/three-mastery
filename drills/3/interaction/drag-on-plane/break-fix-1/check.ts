import type { dragPosition } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkDragOnPlane(_subject: typeof dragPosition): void {
  throw new Error('Write the regression check in check.ts');
}
