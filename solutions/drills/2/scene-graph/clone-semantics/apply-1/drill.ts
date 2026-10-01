// Clone: a variant with independent materials. Write the functions, save, and run: npm run drill -- drills/2/scene-graph/clone-semantics/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// A deep tree clone with shared geometry and separate materials.
export function cloneForVariant(root: THREE.Object3D): Answer<THREE.Object3D> {
  const copy = root.clone(true);
  copy.traverse((child) => { if (child instanceof THREE.Mesh) child.material = Array.isArray(child.material) ? child.material.map((material) => material.clone()) : child.material.clone(); });
  return copy;
}
