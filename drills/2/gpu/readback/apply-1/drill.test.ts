import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { readIdPixel } from './drill';

describe('readIdPixel', () => {
it('requests exactly one pixel and returns the async result', async () => {
    const target = new THREE.WebGLRenderTarget(8,8); const calls: unknown[][] = []; const pixel = new Uint8Array([5,2,1,255]);
    const renderer = { readRenderTargetPixelsAsync: (...args: unknown[]) => {calls.push(args); return Promise.resolve(pixel);} } as unknown as Pick<THREE.WebGLRenderer,'readRenderTargetPixelsAsync'>;
    const result = answered(readIdPixel(renderer,target,3,4)); expect(await result).toEqual(pixel);
    expect(calls).toHaveLength(1); expect(calls[0].slice(0,5)).toEqual([target,3,4,1,1]); target.dispose();
  });
});
