import type { Answer } from '@harness/drill';

export function ratioWhileOrbiting(deviceRatio: number, moving: boolean, cap: number): Answer<number> {
  if (moving) return 1;
  return Math.min(Math.max(1, Number.isFinite(deviceRatio) ? deviceRatio : 1), cap);
}
