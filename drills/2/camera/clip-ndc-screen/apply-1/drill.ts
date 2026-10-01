// Convert a pointer’s CSS pixel position into NDC so a ray can be cast through the camera.
// Check with: npm run drill -- drills/2/camera/clip-ndc-screen/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Convert a pointer’s CSS pixel position into NDC so a ray can be cast through the camera.
export function pixelToNdc(x: number, y: number, width: number, height: number): Answer<THREE.Vector3> {
  return null;
}
