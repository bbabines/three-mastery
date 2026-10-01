// Decide whether an unevenly scaled face points toward a world-space viewer, using its correct world normal.
// Check with: npm run drill -- drills/2/transforms/normal-matrix/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Decide whether an unevenly scaled face points toward a world-space viewer, using its correct world normal.
export function faceToward(part: THREE.Object3D, localNormal: THREE.Vector3, worldView: THREE.Vector3): Answer<boolean> {
  return null;
}
