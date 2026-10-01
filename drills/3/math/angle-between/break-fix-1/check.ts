import type { Spherical } from 'three';

type Turn = (from: Spherical, to: Spherical) => number;

export function checkOrbit(_orbitTurn: Turn): void {
  throw new Error('Write the regression check in check.ts');
}
