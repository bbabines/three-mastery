// Place a model vertex after scale, then rotation, then translation; return its world position without changing inputs.
// Check with: npm run drill -- drills/2/transforms/trs-order/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Place a model vertex after scale, then rotation, then translation; return its world position without changing inputs.
export function placeVertex(vertex: THREE.Vector3, position: THREE.Vector3, rotation: THREE.Quaternion, scale: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}
