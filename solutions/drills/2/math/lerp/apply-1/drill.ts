// Reference answer for drills/2/math/lerp/apply-1.
import type { Answer } from '@harness/drill';
import { MathUtils, Spherical, Vector3 } from 'three';

export interface City {
  lat: number;
  lon: number;
}

export function flightPoint(center: Vector3, radius: number, from: City, to: City, t: number): Answer<Vector3> {
  const lat = MathUtils.lerp(from.lat, to.lat, t);
  const lon = MathUtils.lerp(from.lon, to.lon, t);
  // phi is measured down from straight up, so it's 90° minus the latitude.
  const where = new Spherical(radius, MathUtils.degToRad(90 - lat), MathUtils.degToRad(lon));
  return new Vector3().setFromSpherical(where).add(center);
}
