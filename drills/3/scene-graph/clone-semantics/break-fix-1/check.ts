import type { variant } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkCloneSemantics(_subject: typeof variant): void {
  throw new Error('Write the regression check in check.ts');
}
