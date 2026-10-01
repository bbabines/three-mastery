// Convert a velocity into world space, keeping the effect of scale on its speed but ignoring translation.
// Check with: npm run drill -- drills/2/transforms/points-vs-directions/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Convert a velocity into world space, keeping the effect of scale on its speed but ignoring translation.
export function worldVelocity(localVelocity: THREE.Vector3, transform: THREE.Matrix4): Answer<THREE.Vector3> {
  return null;
}
