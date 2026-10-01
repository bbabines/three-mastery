// Plane drag: a wall slider. Write the functions, save, and run: npm run drill -- drills/2/interaction/drag-on-plane/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The world-space delta along the drag plane.
export function wallDragDelta(startRay: THREE.Ray, moveRay: THREE.Ray, wall: THREE.Plane): Answer<THREE.Vector3> {
  const start = startRay.intersectPlane(wall,new THREE.Vector3());
  const move = moveRay.intersectPlane(wall,new THREE.Vector3());
  return start && move ? move.sub(start) : new THREE.Vector3();
}
