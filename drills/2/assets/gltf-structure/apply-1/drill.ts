// glTF: find nodes using a mesh. Write the functions, save, and run: npm run drill -- drills/2/assets/gltf-structure/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The names of nodes that reference the mesh index.
export function nodeNamesForMesh(document: { nodes: { name?: string; mesh?: number }[] }, meshIndex: number): Answer<string[]> {
  return null;
}
