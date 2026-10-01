// Readback: await an offscreen pixel. Write the functions, save, and run: npm run drill -- drills/2/gpu/readback/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The Promise for one RGBA picking pixel.
export function readIdPixel(renderer: Pick<THREE.WebGLRenderer, "readRenderTargetPixelsAsync">, target: THREE.WebGLRenderTarget, x: number, y: number): Answer<Promise<ArrayBufferView>> {
  return renderer.readRenderTargetPixelsAsync(target,x,y,1,1,new Uint8Array(4));
}
