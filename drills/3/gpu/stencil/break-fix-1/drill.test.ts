import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { maskedTarget } from './drill';

describe('gpu.stencil', () => {
  it('repairs the reported symptom for a general case', () => {
    const target=new THREE.WebGLRenderTarget(100,100), mat=new THREE.MeshBasicMaterial(); maskedTarget(target,mat,4,3); expect(target.samples).toBe(4); expect(target.stencilBuffer).toBe(true); expect(mat.stencilWrite).toBe(true); expect(mat.stencilRef).toBe(3); expect(mat.stencilZPass).toBe(THREE.ReplaceStencilOp);
  });
});
