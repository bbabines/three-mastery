// World bounds: measure a rotated model. Write the functions, save, and run: npm run drill -- drills/2/scene-graph/world-bounds/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The tight world-space size as a Vector3.
export function tightWorldSize(root: THREE.Object3D): Answer<THREE.Vector3> {
  root.updateMatrixWorld(true);
  return new THREE.Box3().setFromObject(root, true).getSize(new THREE.Vector3());
}
