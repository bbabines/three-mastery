// Turn a face normal from model space into world space on a part with uneven scale, without changing the given normal.
// Check with: npm run drill -- drills/2/transforms/normal-matrix/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Turn a face normal from model space into world space on a part with uneven scale, without changing the given normal.
export function normalInWorld(part: THREE.Object3D, localNormal: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}
