// Read a camera’s right direction from its current world basis, including when the camera looks straight up.
// Check with: npm run drill -- drills/2/rotation/rotation-basis/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Read a camera’s right direction from its current world basis, including when the camera looks straight up.
export function cameraRight(camera: THREE.Camera): Answer<THREE.Vector3> {
  return null;
}
