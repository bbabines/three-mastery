// Project a world point to screen pixels for a label, retaining its NDC depth for an off-screen check.
// Check with: npm run drill -- drills/2/camera/project-unproject/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Project a world point to screen pixels for a label, retaining its NDC depth for an off-screen check.
export function labelPosition(camera: THREE.Camera, worldPoint: THREE.Vector3, width: number, height: number): Answer<THREE.Vector3> {
  return null;
}
