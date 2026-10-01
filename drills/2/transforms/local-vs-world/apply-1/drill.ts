// Place a work light a fixed offset from a nested part, returning the light spot in world space without changing the offset.
// Check with: npm run drill -- drills/2/transforms/local-vs-world/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Place a work light a fixed offset from a nested part, returning the light spot in world space without changing the offset.
export function lightWorld(part: THREE.Object3D, localOffset: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}
