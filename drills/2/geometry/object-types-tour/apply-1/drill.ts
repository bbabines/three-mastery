// Build one InstancedMesh for repeated parts that share geometry and material, setting each instance a different pose.
// Check with: npm run drill -- drills/2/geometry/object-types-tour/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Build one InstancedMesh for repeated parts that share geometry and material, setting each instance a different pose.
export function makeRepeatedParts(geometry: THREE.BufferGeometry, material: THREE.Material, count: number): Answer<THREE.InstancedMesh> {
  return null;
}
