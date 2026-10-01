// Find a triangle face normal in world space after its model has been turned and unevenly stretched.
// Check with: npm run drill -- drills/2/geometry/face-normals/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Find a triangle face normal in world space after its model has been turned and unevenly stretched.
export function faceNormalWorld(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, modelToWorld: THREE.Matrix4): Answer<THREE.Vector3> {
  return null;
}
