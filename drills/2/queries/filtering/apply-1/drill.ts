// Pick filtering and bounds early-out. Write the functions, save, and run: npm run drill -- drills/2/queries/filtering/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The nearest name among only the target objects.
export function firstTargetName(ray: THREE.Ray, targets: THREE.Object3D[]): Answer<string> {
  return null;
}

// Whether the forward ray touches the box.
export function rayTouchesBox(ray: THREE.Ray, box: THREE.Box3): Answer<boolean> {
  return null;
}
