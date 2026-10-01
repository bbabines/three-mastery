// Smoothing: move a camera target. Write the functions, save, and run: npm run drill -- drills/2/interaction/frame-rate-independence/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The smoothed world-space target point.
export function smoothedTarget(current: THREE.Vector3, target: THREE.Vector3, lambda: number, dt: number): Answer<THREE.Vector3> {
  return null;
}
