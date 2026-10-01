import type { segmentSnap } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkClosestPoint(_subject: typeof segmentSnap): void {
  throw new Error('Write the regression check in check.ts');
}
