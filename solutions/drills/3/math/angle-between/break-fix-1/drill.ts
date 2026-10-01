import { Spherical } from 'three';

export function orbitTurn(from: Spherical, to: Spherical): number {
  const change = to.theta - from.theta;
  return Math.atan2(Math.sin(change), Math.cos(change));
}
