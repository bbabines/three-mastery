// Blending: fade a selected part. Write the functions, save, and run: npm run drill -- drills/2/gpu/blending/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The material configured for the current fade alpha.
export function fadeMaterial(material: THREE.MeshBasicMaterial, alpha: number): Answer<THREE.MeshBasicMaterial> {
  material.opacity=THREE.MathUtils.clamp(alpha,0,1); material.transparent=material.opacity<1; material.depthWrite=!material.transparent; return material;
}
