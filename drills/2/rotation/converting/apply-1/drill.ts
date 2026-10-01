// Convert a saved Euler turn into an equivalent quaternion, even when a later Euler round-trip uses different angle numbers.
// Check with: npm run drill -- drills/2/rotation/converting/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Convert a saved Euler turn into an equivalent quaternion, even when a later Euler round-trip uses different angle numbers.
export function orientationFromEuler(angles: THREE.Euler): Answer<THREE.Quaternion> {
  return null;
}
