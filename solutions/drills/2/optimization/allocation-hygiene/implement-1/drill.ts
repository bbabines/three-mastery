// Allocation: reuse a ray scratch vector. Write the functions, save, and run: npm run drill -- drills/2/optimization/allocation-hygiene/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The same scratch Vector3 filled with the nearest ray point.
export function closestInto(ray: THREE.Ray, point: THREE.Vector3, scratch: THREE.Vector3): Answer<THREE.Vector3> {
  return ray.closestPointToPoint(point,scratch);
}
