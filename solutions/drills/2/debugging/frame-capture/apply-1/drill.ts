// Frame capture: inspect a target pixel. Write the functions, save, and run: npm run drill -- drills/2/debugging/frame-capture/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The red channel in the rendered target pixel.
export function targetRedByte(renderer: Pick<THREE.WebGLRenderer, "readRenderTargetPixels">, target: THREE.WebGLRenderTarget, x: number, y: number): Answer<number> {
  const pixel=new Uint8Array(4); renderer.readRenderTargetPixels(target,x,y,1,1,pixel); return pixel[0];
}
