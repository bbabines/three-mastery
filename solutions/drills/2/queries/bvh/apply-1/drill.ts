// BVH: count the box tests saved. Write the functions, save, and run: npm run drill -- drills/2/queries/bvh/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The number of bounds tests, including misses.
export function boxTestsForRay(ray: THREE.Ray, root: THREE.Object3D): Answer<number> {
  let count = 0;
  const visit = (node: THREE.Object3D) => { count += 1; if (!ray.intersectsBox(node.userData.bounds as THREE.Box3)) return; for (const child of node.children) visit(child); };
  visit(root);
  return count;
}
