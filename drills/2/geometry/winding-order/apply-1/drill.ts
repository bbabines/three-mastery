// Return a triangle mesh copy with each triangle’s vertex order reversed so its visible front side flips.
// Check with: npm run drill -- drills/2/geometry/winding-order/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Return a triangle mesh copy with each triangle’s vertex order reversed so its visible front side flips.
export function reverseWinding(geometry: THREE.BufferGeometry): Answer<THREE.BufferGeometry> {
  return null;
}
