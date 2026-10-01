export function nextDpr(previous: number, frameMs: number): number {
  return frameMs > 16.7 ? Math.max(1, previous - 0.25) : Math.min(2, previous + 0.25);
}
