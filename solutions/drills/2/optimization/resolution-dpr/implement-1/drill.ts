import type { Answer } from '@harness/drill';

export function pixelRatioFor(deviceRatio: number, cap: number): Answer<number> {
  return Math.min(Math.max(1, Number.isFinite(deviceRatio) ? deviceRatio : 1), cap);
}
