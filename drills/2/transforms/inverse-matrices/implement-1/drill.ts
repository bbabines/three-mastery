// Map a hit point in world space back into a nested part’s local space without moving the part or point.
// Check with: npm run drill -- drills/2/transforms/inverse-matrices/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Map a hit point in world space back into a nested part’s local space without moving the part or point.
export function pointInPart(part: THREE.Object3D, worldPoint: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}
