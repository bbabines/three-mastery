// Aim an ordinary object’s +Z at a target while keeping its +Y as close as possible to a given up direction.
// Check with: npm run drill -- drills/2/rotation/lookat-up/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Aim an ordinary object’s +Z at a target while keeping its +Y as close as possible to a given up direction.
export function aimWithUp(from: THREE.Vector3, target: THREE.Vector3, up: THREE.Vector3): Answer<THREE.Quaternion> {
  return null;
}
