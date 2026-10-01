import type { normalFromMap } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkTangentSpace(_subject: typeof normalFromMap): void {
  throw new Error('Write the regression check in check.ts');
}
