import type { flipFrontFace } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkWindingOrder(_subject: typeof flipFrontFace): void {
  throw new Error('Write the regression check in check.ts');
}
