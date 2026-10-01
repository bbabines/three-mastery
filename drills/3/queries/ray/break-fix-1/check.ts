import type { sphereEntry } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkRay(_subject: typeof sphereEntry): void {
  throw new Error('Write the regression check in check.ts');
}
