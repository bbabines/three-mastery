// Point vs direction: riding a turntable. Write both functions, then save: the page's scene runs them.
// Check them with: npm run drill -- drills/2/math/point-vs-direction/apply-1
//
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import { Matrix4, Vector3 } from 'three';

// Where the hotspot is in the world. `hotspot` is measured from the turntable itself, and
// `matrixWorld` is the turntable's. Don't change either.
export function hotspotInWorld(hotspot: Vector3, matrixWorld: Matrix4): Answer<Vector3> {
  return null;
}

// Which way the beam points in the world, at length 1. `beam` is measured from the turntable itself.
// Don't change either input.
export function beamInWorld(beam: Vector3, matrixWorld: Matrix4): Answer<Vector3> {
  return null;
}
