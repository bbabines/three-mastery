import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { alphaCutout } from './drill';

describe('alphaCutout', () => {
it('uses an alpha threshold while solid pixels still write depth', () => {
    const material = new THREE.MeshBasicMaterial({transparent:true,depthWrite:false});
    const result = answered(alphaCutout(material,0.45)); expect(result).toBe(material);
    expect(material.alphaTest).toBeCloseTo(0.45); expect(material.transparent).toBe(false); expect(material.depthWrite).toBe(true);
  });
});
