import type { nextEmphasis } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkHoverSelection(_subject: typeof nextEmphasis): void {
  throw new Error('Write the regression check in check.ts');
}
