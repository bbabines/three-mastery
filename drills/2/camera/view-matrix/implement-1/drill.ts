// Turn a world point into a camera-space point using the current inverse camera transform.
// Check with: npm run drill -- drills/2/camera/view-matrix/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Turn a world point into a camera-space point using the current inverse camera transform.
export function worldToView(camera: THREE.Camera, worldPoint: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}
