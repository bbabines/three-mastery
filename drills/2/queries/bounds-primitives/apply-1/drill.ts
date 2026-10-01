// Bounds: containment and rotation. Write the functions, save, and run: npm run drill -- drills/2/queries/bounds-primitives/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// Whether the point lies on the positive side of the plane.
export function positiveSide(plane: THREE.Plane, point: THREE.Vector3): Answer<boolean> {
  return null;
}

// The axis-aligned world box size of a rotated Mesh.
export function worldAabbSize(mesh: THREE.Mesh): Answer<THREE.Vector3> {
  return null;
}
