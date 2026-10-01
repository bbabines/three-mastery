import type { cameraRight } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkCameraRelative(_subject: typeof cameraRight): void {
  throw new Error('Write the regression check in check.ts');
}
