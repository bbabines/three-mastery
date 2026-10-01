// Depth: set up an opaque occluder. Write the functions, save, and run: npm run drill -- drills/2/gpu/depth-early-z/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The material configured for opaque depth testing and writing.
export function opaqueOccluder(material: THREE.MeshBasicMaterial): Answer<THREE.MeshBasicMaterial> {
  material.transparent=false; material.depthTest=true; material.depthWrite=true; return material;
}
