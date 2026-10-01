import type { smoothMove } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkFrameRateIndependence(_subject: typeof smoothMove): void {
  throw new Error('Write the regression check in check.ts');
}
