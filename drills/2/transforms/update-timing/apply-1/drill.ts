// Put a marker at the world center of a part directly after the part or one of its parents moves.
// Check with: npm run drill -- drills/2/transforms/update-timing/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Put a marker at the world center of a part directly after the part or one of its parents moves.
export function freshBoundsCenter(part: THREE.Object3D, localCenter: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}
