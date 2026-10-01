import type { worldToView } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkViewMatrix(_subject: typeof worldToView): void {
  throw new Error('Write the regression check in check.ts');
}
