// Hit anatomy: identify an instance. Write the functions, save, and run: npm run drill -- drills/2/queries/intersection-anatomy/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The instance index, or −1 for a non-instanced hit.
export function instanceIndex(hit: THREE.Intersection): Answer<number> {
  return hit.instanceId ?? -1;
}
