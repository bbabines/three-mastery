// Turn a tangent-space normal-map sample from 0–1 colors into a world-space unit normal using the surface TBN basis.
// Check with: npm run drill -- drills/2/geometry/tangent-space/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Turn a tangent-space normal-map sample from 0–1 colors into a world-space unit normal using the surface TBN basis.
export function normalFromMap(sample: THREE.Vector3, tangent: THREE.Vector3, bitangent: THREE.Vector3, normal: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}
