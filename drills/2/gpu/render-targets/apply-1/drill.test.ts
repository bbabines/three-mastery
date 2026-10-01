import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { pickingTarget } from './drill';

describe('pickingTarget', () => {
it('keeps ID colors exact at pixel edges', () => {
    const target = answered(pickingTarget(640,360));
    expect(target.width).toBe(640); expect(target.height).toBe(360);
    expect(target.texture.minFilter).toBe(THREE.NearestFilter); expect(target.texture.magFilter).toBe(THREE.NearestFilter);
    expect(target.samples).toBe(0); target.dispose();
  });
});
