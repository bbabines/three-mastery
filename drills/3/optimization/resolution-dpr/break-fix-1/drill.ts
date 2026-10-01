// Phone pixel budget: diagnose the uncapped device ratio.
export type RatioRenderer = { setPixelRatio(value: number): void };

export function applyPixelBudget(renderer: RatioRenderer, deviceRatio: number): number {
  renderer.setPixelRatio(deviceRatio);
  return deviceRatio;
}
