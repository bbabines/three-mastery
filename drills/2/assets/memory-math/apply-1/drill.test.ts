import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { textureSetBytes } from './drill';

describe('textureSetBytes', () => {
it('adds every mip level and every texture', () => {
    const textures = [{width:8,height:8},{width:4,height:2}];
    const expected = (64+16+4+1+8+2+1)*4;
    expectNumber(textureSetBytes(textures), expected);
    expect(textures).toEqual([{width:8,height:8},{width:4,height:2}]);
  });
});
