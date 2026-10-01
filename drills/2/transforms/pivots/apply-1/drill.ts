// Swing a point on a door around its hinge instead of around the scene origin, keeping the input points intact.
// Check with: npm run drill -- drills/2/transforms/pivots/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Swing a point on a door around its hinge instead of around the scene origin, keeping the input points intact.
export function swingDoor(hinge: THREE.Vector3, point: THREE.Vector3, angle: number): Answer<THREE.Vector3> {
  return null;
}
