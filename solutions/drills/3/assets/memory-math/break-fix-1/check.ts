import { expect } from 'vitest';

type Estimate = (width: number, height: number) => number;

export function checkMipBudget(estimate: Estimate): void {
  const baseBytes = 512 * 256 * 4;
  expect(estimate(512, 256), 'mipmaps consume memory beyond the base image').toBeGreaterThan(baseBytes);
  expect(estimate(1, 1), 'a one-pixel image has no smaller mip').toBe(4);
}
