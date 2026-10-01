// Read the world directions of a camera’s screen right, screen up, and forward, even when it looks straight up.
// Check with: npm run drill -- drills/2/camera/camera-relative/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Read the world directions of a camera’s screen right, screen up, and forward, even when it looks straight up.
export function screenAxes(camera: THREE.Camera): Answer<{ right: THREE.Vector3; up: THREE.Vector3; forward: THREE.Vector3 }> {
  return null;
}
