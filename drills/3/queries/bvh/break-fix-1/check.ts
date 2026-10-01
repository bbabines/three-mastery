import type { candidateLeaves } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkBvh(_subject: typeof candidateLeaves): void {
  throw new Error('Write the regression check in check.ts');
}
