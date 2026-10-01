// Apply a turn around an object’s own axis to its current orientation without changing either input.
// Check with: npm run drill -- drills/2/rotation/quaternions/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Apply a turn around an object’s own axis to its current orientation without changing either input.
export function localDelta(orientation: THREE.Quaternion, localAxis: THREE.Vector3, radians: number): Answer<THREE.Quaternion> {
  return null;
}
