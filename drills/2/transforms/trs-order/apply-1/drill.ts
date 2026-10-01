// Scale and turn a point around a pivot, then put it back in the world at that pivot.
// Check with: npm run drill -- drills/2/transforms/trs-order/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Scale and turn a point around a pivot, then put it back in the world at that pivot.
export function orbitWithScale(point: THREE.Vector3, pivot: THREE.Vector3, rotation: THREE.Quaternion, scale: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}
