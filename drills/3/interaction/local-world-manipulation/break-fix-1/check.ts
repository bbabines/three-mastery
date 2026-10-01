import type { moveByWorld } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkLocalWorldManipulation(_subject: typeof moveByWorld): void {
  throw new Error('Write the regression check in check.ts');
}
