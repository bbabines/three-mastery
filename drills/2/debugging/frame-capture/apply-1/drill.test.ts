import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { targetRedByte } from './drill';

describe('targetRedByte', () => {
it('reads the target contents at the requested pixel', () => {
    const target=new THREE.WebGLRenderTarget(8,8); const calls: unknown[][]=[];
    const renderer={readRenderTargetPixels:(...args: unknown[])=>{calls.push(args); (args[5] as Uint8Array).set([48,2,1,255]);}} as unknown as Pick<THREE.WebGLRenderer,'readRenderTargetPixels'>;
    expectNumber(targetRedByte(renderer,target,3,4),48);
    expect(calls[0].slice(0,5)).toEqual([target,3,4,1,1]); target.dispose();
  });
});
