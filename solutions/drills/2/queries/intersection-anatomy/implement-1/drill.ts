// Hit anatomy: a world normal. Write the functions, save, and run: npm run drill -- drills/2/queries/intersection-anatomy/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The hit face normal in world space.
export function worldHitNormal(normal: THREE.Vector3, object: THREE.Object3D): Answer<THREE.Vector3> {
  object.updateMatrixWorld(true);
  return normal.clone().applyNormalMatrix(new THREE.Matrix3().getNormalMatrix(object.matrixWorld));
}
