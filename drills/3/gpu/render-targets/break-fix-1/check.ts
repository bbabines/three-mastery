import type { captureThumbnail } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkRenderTargets(_subject: typeof captureThumbnail): void {
  throw new Error('Write the regression check in check.ts');
}
