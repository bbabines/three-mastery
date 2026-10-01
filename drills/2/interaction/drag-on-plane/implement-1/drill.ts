// Plane drag: keep the grab offset. Write the functions, save, and run: npm run drill -- drills/2/interaction/drag-on-plane/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The new position in the child's parent space.
export function planeDragLocal(ray: THREE.Ray, plane: THREE.Plane, grabOffset: THREE.Vector3, child: THREE.Object3D): Answer<THREE.Vector3> {
  return null;
}
