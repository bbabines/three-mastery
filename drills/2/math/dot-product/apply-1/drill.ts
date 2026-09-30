// Dot product: hotspots on the far side. Write facesCamera, then save: the page's scene runs it.
// Check it with: npm run drill -- drills/2/math/dot-product/apply-1
//
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import { Vector3 } from 'three';

// True when the camera is on the side the surface faces at `spot`. `normal` is the way the surface
// faces there, at any length. Everything is in the world. Don't change any of the vectors.
export function facesCamera(spot: Vector3, normal: Vector3, cameraPosition: Vector3): Answer<boolean> {
  return null;
}
