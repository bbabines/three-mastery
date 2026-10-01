import type { prepareGlass } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkBlending(_subject: typeof prepareGlass): void {
  throw new Error('Write the regression check in check.ts');
}
