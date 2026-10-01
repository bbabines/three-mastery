// Depth: cut a panel with alpha test. Write the functions, save, and run: npm run drill -- drills/2/gpu/depth-early-z/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The alpha-tested, depth-writing material.
export function alphaCutout(material: THREE.MeshBasicMaterial, cutoff: number): Answer<THREE.MeshBasicMaterial> {
  return null;
}
