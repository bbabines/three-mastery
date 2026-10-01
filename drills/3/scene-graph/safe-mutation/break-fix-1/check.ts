import type { clearMarked } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkSafeMutation(_subject: typeof clearMarked): void {
  throw new Error('Write the regression check in check.ts');
}
