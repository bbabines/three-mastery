import type { pickPixel } from './drill';

// Write one behavior assertion that rejects the original bug.
export function checkReadback(_subject: typeof pickPixel): Promise<void> {
  throw new Error('Write the regression check in check.ts');
}
