import type { moveInterleaved } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkInterleaved(_subject: typeof moveInterleaved): void {
  throw new Error('Write the regression check in check.ts');
}
