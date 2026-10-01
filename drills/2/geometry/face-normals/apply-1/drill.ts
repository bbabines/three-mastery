// Use a triangle’s geometric face normal to tell whether its front faces a world-space view direction.
// Check with: npm run drill -- drills/2/geometry/face-normals/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Use a triangle’s geometric face normal to tell whether its front faces a world-space view direction.
export function flatFaceToward(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, worldView: THREE.Vector3): Answer<boolean> {
  return null;
}
