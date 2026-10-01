import { Spherical, Vector3 } from 'three';

// Signed azimuth change from from to to, wrapped to -π..π.
export function orbitTurn(from: Spherical, to: Spherical): number {
  const fromPoint = new Vector3().setFromSpherical(from);
  const toPoint = new Vector3().setFromSpherical(to);
  return fromPoint.angleTo(toPoint);
}
