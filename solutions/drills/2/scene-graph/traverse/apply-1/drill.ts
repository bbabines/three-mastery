// Traverse: find the product root. Write the functions, save, and run: npm run drill -- drills/2/scene-graph/traverse/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The nearest product ID above a clicked mesh, or an empty string.
export function productIdForHit(hit: THREE.Object3D): Answer<string> {
  let id = '';
  hit.traverseAncestors((ancestor) => { if (!id && typeof ancestor.userData.productId === 'string') id = ancestor.userData.productId; });
  return id;
}
