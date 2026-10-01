// Clone: a separate finish. Write the functions, save, and run: npm run drill -- drills/2/scene-graph/clone-semantics/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// A colored clone with shared geometry and independent material.
export function coloredClone(source: THREE.Mesh, color: THREE.ColorRepresentation): Answer<THREE.Mesh> {
  const clone = source.clone();
  clone.material = (source.material as THREE.MeshStandardMaterial).clone();
  (clone.material as THREE.MeshStandardMaterial).color.set(color);
  return clone;
}
