import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { rgbaMipBytes } from './drill';

describe('rgbaMipBytes', () => {
it('counts each mip level down to one pixel', () => {
    expectNumber(rgbaMipBytes(4,4),(16+4+1)*4); expectNumber(rgbaMipBytes(8,2),(16+4+2+1)*4);
    expect(answered(rgbaMipBytes(8,8))).toBeGreaterThan(8*8*4);
  });
});
