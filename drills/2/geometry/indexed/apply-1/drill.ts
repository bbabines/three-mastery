// Make a copy of indexed geometry whose triangles have separate vertices so each face can carry its own color.
// Check with: npm run drill -- drills/2/geometry/indexed/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Make a copy of indexed geometry whose triangles have separate vertices so each face can carry its own color.
export function separateFaces(geometry: THREE.BufferGeometry): Answer<THREE.BufferGeometry> {
  return null;
}
