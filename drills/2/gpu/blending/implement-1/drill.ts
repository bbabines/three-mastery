// Blending: set up a glass layer. Write the functions, save, and run: npm run drill -- drills/2/gpu/blending/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The blended, depth-tested, non-depth-writing material.
export function glassMaterial(material: THREE.MeshBasicMaterial, opacity: number): Answer<THREE.MeshBasicMaterial> {
  return null;
}
