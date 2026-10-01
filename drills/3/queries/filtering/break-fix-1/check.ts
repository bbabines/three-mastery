import type { selectableBoxHit } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkFiltering(_subject: typeof selectableBoxHit): void {
  throw new Error('Write the regression check in check.ts');
}
