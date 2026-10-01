// Anchor: hide an occluded price tag. Write the functions, save, and run: npm run drill -- drills/2/interaction/anchoring/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// Whether the label can be seen from the camera.
export function labelUnoccluded(world: THREE.Vector3, camera: THREE.Camera, blockers: THREE.Object3D[]): Answer<boolean> {
  return null;
}
