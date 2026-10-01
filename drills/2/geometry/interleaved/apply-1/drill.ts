// Move a vertex in an interleaved position attribute by vertex number, then mark its shared buffer for upload.
// Check with: npm run drill -- drills/2/geometry/interleaved/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Move a vertex in an interleaved position attribute by vertex number, then mark its shared buffer for upload.
export function moveInterleavedVertex(position: THREE.InterleavedBufferAttribute, index: number, newPosition: THREE.Vector3): Answer<boolean> {
  return null;
}
