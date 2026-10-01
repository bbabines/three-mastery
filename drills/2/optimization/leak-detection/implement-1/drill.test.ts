import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { swapMemoryDelta } from './drill';

describe('swapMemoryDelta', () => {
it('measures after every swap and catches retained resources', () => {
    const memory={geometries:2,textures:1}; let renders=0,swaps=0;
    const renderer={info:{memory},render:()=>{renders++;}} as unknown as Pick<THREE.WebGLRenderer,'render'|'info'>;
    const result=answered(swapMemoryDelta(renderer,new THREE.Scene(),new THREE.PerspectiveCamera(),()=>{swaps++;memory.textures++;},20));
    expect(result).toEqual({geometries:0,textures:20}); expect(renders).toBe(21); expect(swaps).toBe(20);
  });
});
