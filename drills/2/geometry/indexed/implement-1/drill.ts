// Read the three local-space corners of one triangle from either indexed or non-indexed geometry.
// Check with: npm run drill -- drills/2/geometry/indexed/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Read the three local-space corners of one triangle from either indexed or non-indexed geometry.
export function triangleVertices(geometry: THREE.BufferGeometry, triangleIndex: number): Answer<[THREE.Vector3, THREE.Vector3, THREE.Vector3]> {
  return null;
}
