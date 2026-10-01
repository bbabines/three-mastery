// Allocation: reuse a bounds scratch box. Write the functions, save, and run: npm run drill -- drills/2/optimization/allocation-hygiene/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The same Box3 filled with current world bounds.
export function boundsInto(root: THREE.Object3D, scratch: THREE.Box3): Answer<THREE.Box3> {
  root.updateWorldMatrix(true,true); return scratch.setFromObject(root,true);
}
