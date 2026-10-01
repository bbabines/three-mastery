// Rebuild a mesh’s per-vertex normals for smooth shading after its positions change, preserving the original geometry.
// Check with: npm run drill -- drills/2/geometry/vertex-normals/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Rebuild a mesh’s per-vertex normals for smooth shading after its positions change, preserving the original geometry.
export function smoothNormals(geometry: THREE.BufferGeometry): Answer<THREE.BufferGeometry> {
  return null;
}
