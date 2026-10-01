import type { fitAndPixelSize } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkFitToBounds(_subject: typeof fitAndPixelSize): void {
  throw new Error('Write the regression check in check.ts');
}
