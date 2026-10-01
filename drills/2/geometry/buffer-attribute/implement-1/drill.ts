// Read one vertex’s XYZ position from a flat position attribute using its item size.
// Check with: npm run drill -- drills/2/geometry/buffer-attribute/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Read one vertex’s XYZ position from a flat position attribute using its item size.
export function vertexPosition(position: THREE.BufferAttribute, index: number): Answer<THREE.Vector3> {
  return null;
}
