// First use: pre-compile a variant. Write the functions, save, and run: npm run drill -- drills/2/assets/decode-upload-compile/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The shader compilation Promise for that scene and camera.
export function precompileVariant(renderer: Pick<THREE.WebGLRenderer, "compileAsync">, scene: THREE.Scene, camera: THREE.Camera): Answer<Promise<THREE.Object3D>> {
  return renderer.compileAsync(scene, camera);
}
