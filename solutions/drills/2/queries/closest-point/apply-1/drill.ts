// Closest point: snap to an edge. Write the functions, save, and run: npm run drill -- drills/2/queries/closest-point/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The nearest point on the finite edge.
export function snapToEdge(point: THREE.Vector3, edge: THREE.Line3): Answer<THREE.Vector3> {
  return edge.closestPointToPoint(point, true, new THREE.Vector3());
}
