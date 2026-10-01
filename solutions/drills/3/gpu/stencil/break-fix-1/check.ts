import * as THREE from 'three';
import { expect } from 'vitest';
import type { maskedTarget } from './drill';

export function checkStencil(subject: typeof maskedTarget): void {
  const target=new THREE.WebGLRenderTarget(200,100), mat=new THREE.MeshBasicMaterial(); subject(target,mat,8,5); expect(target.samples).toBe(8); expect(target.stencilBuffer).toBe(true); expect(mat.stencilRef).toBe(5); expect(mat.stencilFunc).toBe(THREE.AlwaysStencilFunc);
}
