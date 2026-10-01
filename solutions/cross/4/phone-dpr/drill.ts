import type { Answer } from '@harness/drill';

export function budgetedDpr(width: number, height: number, deviceDpr: number, maxPixels: number): Answer<number> {
  if (width <= 0 || height <= 0 || deviceDpr <= 0 || maxPixels <= 0) return 1;
  return Math.min(deviceDpr, Math.sqrt(maxPixels / (width * height)));
}
