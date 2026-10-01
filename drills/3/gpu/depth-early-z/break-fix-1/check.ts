import type { depthWork } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkDepthEarlyZ(_subject: typeof depthWork): void {
  throw new Error('Write the regression check in check.ts');
}
