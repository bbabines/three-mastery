import type { screenY } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkClipNdcScreen(_subject: typeof screenY): void {
  throw new Error('Write the regression check in check.ts');
}
