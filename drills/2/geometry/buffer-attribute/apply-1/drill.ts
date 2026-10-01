// Read a mesh vertex’s RGB color from a packed color attribute without confusing flat array offsets with vertex numbers.
// Check with: npm run drill -- drills/2/geometry/buffer-attribute/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Read a mesh vertex’s RGB color from a packed color attribute without confusing flat array offsets with vertex numbers.
export function vertexColor(colors: THREE.BufferAttribute, vertexIndex: number): Answer<THREE.Vector3> {
  return null;
}
