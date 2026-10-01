import { expect } from 'vitest';
import type { RatioRenderer } from './drill';

type Apply = (renderer: RatioRenderer, deviceRatio: number) => number;

export function checkPhoneBudget(apply: Apply): void {
  let set = 0;
  const renderer = { setPixelRatio: (ratio: number) => { set = ratio; } };
  expect(apply(renderer, 3), 'a DPR 3 phone should respect the cap').toBe(2);
  expect(set).toBe(2);
}
