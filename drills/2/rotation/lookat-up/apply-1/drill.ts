// Aim a camera’s −Z at a target, respecting the chosen up vector and keeping the input positions intact.
// Check with: npm run drill -- drills/2/rotation/lookat-up/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Aim a camera’s −Z at a target, respecting the chosen up vector and keeping the input positions intact.
export function cameraAim(from: THREE.Vector3, target: THREE.Vector3, up: THREE.Vector3): Answer<THREE.Quaternion> {
  return null;
}
