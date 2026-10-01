import type { vertexAt } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkBufferAttribute(_subject: typeof vertexAt): void {
  throw new Error('Write the regression check in check.ts');
}
