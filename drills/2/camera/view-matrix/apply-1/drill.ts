// Find how far a world point lies in front of the camera along its viewing axis, rather than its straight-line distance.
// Check with: npm run drill -- drills/2/camera/view-matrix/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Find how far a world point lies in front of the camera along its viewing axis, rather than its straight-line distance.
export function viewDepth(camera: THREE.Camera, worldPoint: THREE.Vector3): Answer<number> {
  return null;
}
