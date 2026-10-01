// Finding and changing a loaded tree. Write the functions, save, and run: npm run drill -- drills/2/scene-graph/finding-objects/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// All meshes with that name, even when names repeat.
export function namedMeshes(root: THREE.Object3D, name: string): Answer<THREE.Mesh[]> {
  return null;
}

// How many helper objects were removed.
export function removeTaggedHelpers(root: THREE.Object3D): Answer<number> {
  return null;
}
