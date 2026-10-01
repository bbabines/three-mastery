import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { stencilWriter, msaaTarget } from './drill';

describe('stencilWriter', () => {
it('writes the selected stencil reference on depth pass', () => {
    const material = new THREE.MeshBasicMaterial(); const result = answered(stencilWriter(material,3));
    expect(result).toBe(material); expect(material.stencilWrite).toBe(true); expect(material.stencilRef).toBe(3);
    expect(material.stencilFunc).toBe(THREE.AlwaysStencilFunc); expect(material.stencilZPass).toBe(THREE.ReplaceStencilOp);
  });
});

describe('msaaTarget', () => {
it('sets samples on the offscreen target itself', () => {
    const target = answered(msaaTarget(320,180,4)); expect(target.width).toBe(320); expect(target.height).toBe(180);
    expect(target.samples).toBe(4); target.dispose();
  });
});
