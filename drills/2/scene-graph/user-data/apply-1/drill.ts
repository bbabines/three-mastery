// Metadata: select and highlight a part. Write the functions, save, and run: npm run drill -- drills/2/scene-graph/user-data/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The nearest selectable ID, or an empty string.
export function selectableId(hit: THREE.Object3D): Answer<string> {
  return null;
}

// The original material, while the mesh receives the replacement.
export function swapMaterial(mesh: THREE.Mesh, replacement: THREE.Material): Answer<THREE.Material> {
  return null;
}
