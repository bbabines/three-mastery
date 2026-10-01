// Move a ray from model space into world space: its point moves with translation, while its direction does not.
// Check with: npm run drill -- drills/2/transforms/points-vs-directions/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Move a ray from model space into world space: its point moves with translation, while its direction does not.
export function moveRay(point: THREE.Vector3, direction: THREE.Vector3, transform: THREE.Matrix4): Answer<{ point: THREE.Vector3; direction: THREE.Vector3 }> {
  return null;
}
