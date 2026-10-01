import type { focusView } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkOrbitPanDolly(_subject: typeof focusView): void {
  throw new Error('Write the regression check in check.ts');
}
