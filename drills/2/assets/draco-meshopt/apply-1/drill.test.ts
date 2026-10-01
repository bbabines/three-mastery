import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { chooseGeometryCodec, rgbaTextureBytes } from './drill';

describe('chooseGeometryCodec', () => {
it('uses decode budget rather than download size alone', () => {
    expectExact(chooseGeometryCodec(180000,90,210000,12,25), 'meshopt');
    expectExact(chooseGeometryCodec(180000,18,210000,12,25), 'draco');
  });
});

describe('rgbaTextureBytes', () => {
it('counts decoded RGBA pixels, including all mip levels', () => {
    expectNumber(rgbaTextureBytes(4,4,false), 4*4*4);
    expectNumber(rgbaTextureBytes(4,4,true), (16+4+1)*4);
    expectNumber(rgbaTextureBytes(8,2,true), (16+4+2+1)*4);
  });
});
