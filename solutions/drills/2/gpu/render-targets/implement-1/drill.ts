// Render target: an offscreen thumbnail. Write the functions, save, and run: npm run drill -- drills/2/gpu/render-targets/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// A thumbnail-sized offscreen render target.
export function thumbnailTarget(width: number, height: number): Answer<THREE.WebGLRenderTarget> {
  return new THREE.WebGLRenderTarget(width,height,{depthBuffer:true,stencilBuffer:false});
}
