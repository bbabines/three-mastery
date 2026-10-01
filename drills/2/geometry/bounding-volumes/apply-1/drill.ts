// Recompute a geometry’s local-space bounding sphere after direct edits to its position array.
// Check with: npm run drill -- drills/2/geometry/bounding-volumes/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Recompute a geometry’s local-space bounding sphere after direct edits to its position array.
export function freshBoundingSphere(geometry: THREE.BufferGeometry): Answer<THREE.Sphere> {
  return null;
}
