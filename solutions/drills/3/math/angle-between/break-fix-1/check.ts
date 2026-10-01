import { expect } from 'vitest';
import { Spherical } from 'three';

type Turn = (from: Spherical, to: Spherical) => number;

export function checkOrbit(orbitTurn: Turn): void {
  const from = new Spherical(2, 0.8, 0.2);
  const to = new Spherical(5, 1.9, -0.5);
  expect(orbitTurn(from, to)).toBeCloseTo(Math.atan2(Math.sin(to.theta - from.theta), Math.cos(to.theta - from.theta)));
}
