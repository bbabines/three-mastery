export function nextDpr(previous: number, frameMs: number): number {
  if (frameMs > 20) return Math.max(1, previous - 0.25);
  if (frameMs < 14) return Math.min(2, previous + 0.25);
  return previous;
}
