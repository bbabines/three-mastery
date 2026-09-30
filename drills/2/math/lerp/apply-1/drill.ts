// Lerp and spherical coordinates: a flight across a globe. Write flightPoint, then save: the page's
// scene runs it. Check it with: npm run drill -- drills/2/math/lerp/apply-1
//
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import { Vector3 } from 'three';

// A city on the globe, in degrees. lat: north of the equator (90 is +Y). lon: around (0 faces +Z,
// 90 faces +X).
export interface City {
  lat: number;
  lon: number;
}

// Where the plane is at fraction `t` of the way from `from` to `to`, on the surface of a globe of
// `radius` centered on `center`, with latitude and longitude each changing steadily with t.
// Don't change center, from, or to.
export function flightPoint(center: Vector3, radius: number, from: City, to: City, t: number): Answer<Vector3> {
  return null;
}
