import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { memoryGrew } from './drill';

describe('memoryGrew', () => {
it('flags a slow 20-cycle climb but accepts a stable baseline', () => {
    const stable=Array.from({length:21},()=>({geometries:3,textures:4})); expectExact(memoryGrew(stable),false);
    const rising=stable.map((sample,i)=>({...sample,textures:sample.textures+Math.floor(i/5)})); expectExact(memoryGrew(rising),true);
    expectExact(memoryGrew([{geometries:3,textures:4}]),false);
  });
});
