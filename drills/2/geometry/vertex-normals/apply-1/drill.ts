// Give each triangle its own vertices and face normals to make a low-poly model show hard edges.
// Check with: npm run drill -- drills/2/geometry/vertex-normals/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Give each triangle its own vertices and face normals to make a low-poly model show hard edges.
export function hardEdges(geometry: THREE.BufferGeometry): Answer<THREE.BufferGeometry> {
  return null;
}
