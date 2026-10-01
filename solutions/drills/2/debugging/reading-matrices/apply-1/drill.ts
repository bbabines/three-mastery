// Matrix reading: detect a mirror. Write the functions, save, and run: npm run drill -- drills/2/debugging/reading-matrices/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// Whether the world transform reverses handedness.
export function mirrorsSpace(matrix: THREE.Matrix4): Answer<boolean> {
  return matrix.determinant()<0;
}
