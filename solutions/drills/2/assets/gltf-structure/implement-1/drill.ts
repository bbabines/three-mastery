// glTF: count primitives in a mesh. Write the functions, save, and run: npm run drill -- drills/2/assets/gltf-structure/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The number of glTF primitives for one mesh index.
export function primitiveCount(document: { meshes: { primitives: unknown[] }[] }, meshIndex: number): Answer<number> {
  return document.meshes[meshIndex]?.primitives.length ?? 0;
}
