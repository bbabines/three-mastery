import type { placeInstance } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkObjectTypesTour(_subject: typeof placeInstance): void {
  throw new Error('Write the regression check in check.ts');
}
