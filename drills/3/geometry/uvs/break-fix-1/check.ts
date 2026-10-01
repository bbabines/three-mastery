import type { tileFirstFace } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkUvs(_subject: typeof tileFirstFace): void {
  throw new Error('Write the regression check in check.ts');
}
