// Axis drag: project movement onto a rail. Write the functions, save, and run: npm run drill -- drills/2/interaction/axis-drag/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The world-space drag movement along the axis.
export function railDelta(start: THREE.Vector3, end: THREE.Vector3, axis: THREE.Vector3): Answer<THREE.Vector3> {
  return end.clone().sub(start).projectOnVector(axis);
}
