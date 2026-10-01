// Ray and sphere: choose a forward hit. Write the functions, save, and run: npm run drill -- drills/2/queries/ray/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The point at that distance along the forward ray.
export function pointAhead(ray: THREE.Ray, distance: number): Answer<THREE.Vector3> {
  return ray.at(distance, new THREE.Vector3());
}

// The hotspot hit in front of the ray, or its origin on a miss.
export function hotspotPoint(ray: THREE.Ray, sphere: THREE.Sphere): Answer<THREE.Vector3> {
  return ray.intersectSphere(sphere, new THREE.Vector3()) ?? ray.origin.clone();
}
