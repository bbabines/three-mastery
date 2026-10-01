import type { Answer } from '@harness/drill';
import type { WebGLRenderer, WebGLRenderTarget } from 'three';

export async function readPickId(renderer: WebGLRenderer, target: WebGLRenderTarget, x: number, y: number): Promise<Answer<number>> {
  const pixel = new Uint8Array(4);
  await renderer.readRenderTargetPixelsAsync(target, x, y, 1, 1, pixel);
  return pixel[0] + pixel[1] * 256 + pixel[2] * 65536;
}
