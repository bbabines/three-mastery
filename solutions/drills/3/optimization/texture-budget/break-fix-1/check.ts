import { expect } from 'vitest';

type Choose = (cssPixels: number, dpr: number, sourceSize: number) => number;

export function checkTextureBudget(choose: Choose): void {
  expect(choose(160, 2, 4096), 'a small thumbnail cannot show 4K detail').toBe(512);
  expect(choose(2400, 2, 4096)).toBe(4096);
}
