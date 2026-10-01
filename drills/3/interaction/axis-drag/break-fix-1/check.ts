import type { railPosition } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkAxisDrag(_subject: typeof railPosition): void {
  throw new Error('Write the regression check in check.ts');
}
