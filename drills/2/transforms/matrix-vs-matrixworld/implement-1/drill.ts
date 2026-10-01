// Save the full world transform of a nested part after its parent has moved, leaving the part and parent untouched.
// Check with: npm run drill -- drills/2/transforms/matrix-vs-matrixworld/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Save the full world transform of a nested part after its parent has moved, leaving the part and parent untouched.
export function worldTransform(part: THREE.Object3D): Answer<THREE.Matrix4> {
  return null;
}
