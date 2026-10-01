// Copy a triangle mesh and shift its first UV island for a different material tile, preserving the original UVs.
// Check with: npm run drill -- drills/2/geometry/uvs/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Copy a triangle mesh and shift its first UV island for a different material tile, preserving the original UVs.
export function assignFaceUv(geometry: THREE.BufferGeometry, uv: THREE.Vector2): Answer<THREE.BufferGeometry> {
  return null;
}
