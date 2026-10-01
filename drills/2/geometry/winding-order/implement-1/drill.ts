// Tell whether a triangle’s counter-clockwise front side faces a viewer along the given direction.
// Check with: npm run drill -- drills/2/geometry/winding-order/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Tell whether a triangle’s counter-clockwise front side faces a viewer along the given direction.
export function frontFacesViewer(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, viewDirection: THREE.Vector3): Answer<boolean> {
  return null;
}
