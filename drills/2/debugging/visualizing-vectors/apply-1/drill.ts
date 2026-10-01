// Vectors: draw a safe world direction. Write the functions, save, and run: npm run drill -- drills/2/debugging/visualizing-vectors/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The unit direction for a world-space ArrowHelper.
export function worldArrowDirection(object: THREE.Object3D, local: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}

// The unchanged finite vector or a zero-vector fallback.
export function finiteOrZero(vector: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}
