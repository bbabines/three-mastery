export type RatioRenderer = { setPixelRatio(value: number): void };

export function applyPixelBudget(renderer: RatioRenderer, deviceRatio: number): number {
  const ratio = Math.min(deviceRatio, 2);
  renderer.setPixelRatio(ratio);
  return ratio;
}
