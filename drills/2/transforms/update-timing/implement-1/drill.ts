// Get a point on a part in world space immediately after an ancestor moves, before another frame renders.
// Check with: npm run drill -- drills/2/transforms/update-timing/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Get a point on a part in world space immediately after an ancestor moves, before another frame renders.
export function freshWorldPoint(part: THREE.Object3D, localPoint: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}
