import type { labelVisible } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkProjectUnproject(_subject: typeof labelVisible): void {
  throw new Error('Write the regression check in check.ts');
}
