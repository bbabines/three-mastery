// Isolation: show one scene branch. Write the functions, save, and run: npm run drill -- drills/2/debugging/isolation/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The number of sibling branches hidden for isolation.
export function showOnlyBranch(root: THREE.Object3D, keep: THREE.Object3D): Answer<number> {
  let hidden=0; for (const child of root.children) { if (child!==keep) { child.visible=false; hidden++; } else child.visible=true; } return hidden;
}
