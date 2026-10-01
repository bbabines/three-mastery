import type { labelState } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkAnchoring(_subject: typeof labelState): void {
  throw new Error('Write the regression check in check.ts');
}
