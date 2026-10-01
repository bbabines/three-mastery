import { expectExact } from '@harness/check';
import type { WebGLRenderer, WebGLRenderTarget } from 'three';
import { describe, expect, it, vi } from 'vitest';
import { readPickId } from './drill';

describe('asynchronous picking readback', () => {
  it.each([[0,0,0],[1,2,3],[255,128,17]])('decodes the RGB id', async (r,g,b) => {
    const readRenderTargetPixelsAsync = vi.fn(async (_target: unknown, _x: number, _y: number, _w: number, _h: number, out: Uint8Array) => {
      out.set([r,g,b,255]);
      return out;
    });
    const renderer = { readRenderTargetPixelsAsync } as unknown as WebGLRenderer;
    const target = {} as WebGLRenderTarget;
    expectExact(await readPickId(renderer,target,4,7), r+g*256+b*65536);
    expect(readRenderTargetPixelsAsync).toHaveBeenCalledWith(target,4,7,1,1,expect.any(Uint8Array));
  });
});
