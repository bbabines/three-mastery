// BVH: prune boxes before leaves. Write the functions, save, and run: npm run drill -- drills/2/queries/bvh/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// IDs of leaf boxes touched by the ray.
export function candidateLeafIds(ray: THREE.Ray, root: THREE.Object3D): Answer<string[]> {
  return null;
}
