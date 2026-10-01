// Measure the depth-buffer value of a surface at a given distance along a perspective camera’s view axis.
// Check with: npm run drill -- drills/2/camera/depth-precision/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Measure the depth-buffer value of a surface at a given distance along a perspective camera’s view axis.
export function depthAt(camera: THREE.PerspectiveCamera, viewDepth: number): Answer<number> {
  return null;
}
