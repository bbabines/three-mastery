// Isolation: bisect a scene. Write the functions, save, and run: npm run drill -- drills/2/debugging/isolation/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// Names of the visible half of the scene.
export function visibleSlice(root: THREE.Object3D, start: number, end: number): Answer<string[]> {
  return null;
}
