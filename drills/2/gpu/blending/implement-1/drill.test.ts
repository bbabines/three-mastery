import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { glassMaterial } from './drill';

describe('glassMaterial', () => {
it('keeps a translucent surface from writing opaque depth', () => {
    const material = new THREE.MeshBasicMaterial(); const result = answered(glassMaterial(material,0.35));
    expect(result).toBe(material); expect(material.opacity).toBeCloseTo(0.35);
    expect([material.transparent,material.depthTest,material.depthWrite]).toEqual([true,true,false]);
  });
});
