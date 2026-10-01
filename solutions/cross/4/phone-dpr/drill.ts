import type { Answer } from '@harness/drill';

export function budgetedDpr(width: number, height: number, deviceDpr: number, maxPixels: number): Answer<number> {
  if (![width, height, deviceDpr, maxPixels].every((value) => Number.isFinite(value) && value > 0)) return 1;
  return Math.min(deviceDpr, Math.sqrt(maxPixels / (width * height)));
}
