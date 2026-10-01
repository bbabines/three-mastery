// Apply a turn around an axis measured in the parent’s frame, preserving the current orientation.
// Check with: npm run drill -- drills/2/rotation/quaternions/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Apply a turn around an axis measured in the parent’s frame, preserving the current orientation.
export function parentDelta(orientation: THREE.Quaternion, parentAxis: THREE.Vector3, radians: number): Answer<THREE.Quaternion> {
  return null;
}
