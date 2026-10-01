// Move a part into a new group with the Object3D attach operation, keeping the part at the same world spot.
// Check with: npm run drill -- drills/2/transforms/object3d-tour/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Move a part into a new group with the Object3D attach operation, keeping the part at the same world spot.
export function keepWorldOnAttach(part: THREE.Object3D, newParent: THREE.Object3D): Answer<THREE.Vector3> {
  return null;
}
