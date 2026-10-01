// BVH: prune boxes before leaves. Write the functions, save, and run: npm run drill -- drills/2/queries/bvh/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// IDs of leaf boxes touched by the ray.
export function candidateLeafIds(ray: THREE.Ray, root: THREE.Object3D): Answer<string[]> {
  const ids: string[] = [];
  const visit = (node: THREE.Object3D) => { const box = node.userData.bounds as THREE.Box3; if (!ray.intersectsBox(box)) return; if (typeof node.userData.leafId === 'string') ids.push(node.userData.leafId); else for (const child of node.children) visit(child); };
  visit(root);
  return ids;
}
