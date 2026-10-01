// Shader cost and hitches: choose, then pre-warm. Write the functions, save, and run: npm run drill -- drills/2/optimization/shader-cost/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// How many optional physical shader features are enabled.
export function enabledPhysicalFeatures(material: THREE.MeshPhysicalMaterial): Answer<number> {
  return Number(material.clearcoat>0)+Number(material.sheen>0)+Number(material.transmission>0);
}

// The Promise for shader compilation before first use.
export function precompileScene(renderer: Pick<THREE.WebGLRenderer, "compileAsync">, scene: THREE.Scene, camera: THREE.Camera): Answer<Promise<THREE.Object3D>> {
  return renderer.compileAsync(scene,camera);
}
