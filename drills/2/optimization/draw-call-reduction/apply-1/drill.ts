// Draw calls: batch matching part types. Write the functions, save, and run: npm run drill -- drills/2/optimization/draw-call-reduction/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// Instanced batches grouped by exact shared data.
export function batchMatchingParts(parts: { geometry: THREE.BufferGeometry; material: THREE.Material; world: THREE.Matrix4 }[]): Answer<THREE.InstancedMesh[]> {
  return null;
}
