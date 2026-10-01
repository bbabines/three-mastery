import type { triangleAt } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkIndexed(_subject: typeof triangleAt): void {
  throw new Error('Write the regression check in check.ts');
}
