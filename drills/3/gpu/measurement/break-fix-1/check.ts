import type { measureSubmission } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkMeasurement(_subject: typeof measureSubmission): void {
  throw new Error('Write the regression check in check.ts');
}
