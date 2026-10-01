import type { headroomMs } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkFrameBudget(_subject: typeof headroomMs): void {
  throw new Error('Write the regression check in check.ts');
}
