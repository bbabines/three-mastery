// First use: pre-upload a texture. Write the functions, save, and run: npm run drill -- drills/2/assets/decode-upload-compile/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The same texture after requesting an early GPU upload.
export function preuploadTexture(renderer: Pick<THREE.WebGLRenderer, "initTexture">, texture: THREE.Texture): Answer<THREE.Texture> {
  renderer.initTexture(texture);
  return texture;
}
