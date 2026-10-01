// Find where the origin of a part inside a moving rack ends up in the world by reading its current world matrix.
// Check with: npm run drill -- drills/2/transforms/matrix-vs-matrixworld/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Find where the origin of a part inside a moving rack ends up in the world by reading its current world matrix.
export function worldOrigin(part: THREE.Object3D): Answer<THREE.Vector3> {
  return null;
}
