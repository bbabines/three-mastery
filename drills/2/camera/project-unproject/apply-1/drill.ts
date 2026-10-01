// Unproject a chosen NDC spot and depth into a world point, updating the camera after a move.
// Check with: npm run drill -- drills/2/camera/project-unproject/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Unproject a chosen NDC spot and depth into a world point, updating the camera after a move.
export function pointAtNdcDepth(camera: THREE.Camera, x: number, y: number, depth: number): Answer<THREE.Vector3> {
  return null;
}
