import { expect } from 'vitest';

type Decide = (previous: number, frameMs: number) => number;

export function checkDeadBand(nextDpr: Decide): void {
  let dpr = 1.5;
  for (const frameMs of [16.4, 17.2, 16.6, 17.1]) dpr = nextDpr(dpr, frameMs);
  expect(dpr, 'timing noise must not change quality').toBe(1.5);
  expect(nextDpr(dpr, 22)).toBeLessThan(dpr);
}
