import type { depthBufferValue } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkDepthPrecision(_subject: typeof depthBufferValue): void {
  throw new Error('Write the regression check in check.ts');
}
