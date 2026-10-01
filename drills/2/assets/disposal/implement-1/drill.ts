// Dispose: release only owned resources. Write the functions, save, and run: npm run drill -- drills/2/assets/disposal/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The number of unique owned resources disposed.
export function disposeMeshOwned(mesh: THREE.Mesh, shared: Set<THREE.Material | THREE.BufferGeometry | THREE.Texture>): Answer<number> {
  return null;
}
