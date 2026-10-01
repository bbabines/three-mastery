// Visibility: check a model and show its bounds. Write the functions, save, and run: npm run drill -- drills/2/debugging/nothing-renders/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// Whether the object world bounds touch the camera frustum.
export function inCameraView(object: THREE.Object3D, camera: THREE.Camera): Answer<boolean> {
  return null;
}

// A BoxHelper that shows the object bounds.
export function boundsHelper(object: THREE.Object3D): Answer<THREE.BoxHelper> {
  return null;
}
