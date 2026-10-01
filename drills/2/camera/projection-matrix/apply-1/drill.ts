// Build an orthographic lens that maps a chosen world-space box into the picture without perspective shrinking.
// Check with: npm run drill -- drills/2/camera/projection-matrix/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Build an orthographic lens that maps a chosen world-space box into the picture without perspective shrinking.
export function orthoForBox(left: number, right: number, top: number, bottom: number, near: number, far: number): Answer<THREE.Matrix4> {
  return null;
}
