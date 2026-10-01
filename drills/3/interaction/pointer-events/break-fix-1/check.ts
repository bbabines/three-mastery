import type { isClick } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkPointerEvents(_subject: typeof isClick): void {
  throw new Error('Write the regression check in check.ts');
}
