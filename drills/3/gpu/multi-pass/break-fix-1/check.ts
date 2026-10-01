import type { passCost } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkMultiPass(_subject: typeof passCost): void {
  throw new Error('Write the regression check in check.ts');
}
