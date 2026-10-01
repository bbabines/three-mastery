import type { maskedTarget } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkStencil(_subject: typeof maskedTarget): void {
  throw new Error('Write the regression check in check.ts');
}
