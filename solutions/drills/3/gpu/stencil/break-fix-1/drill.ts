// Reference repair for drills/3/gpu/stencil/break-fix-1.
import * as THREE from 'three';

export function maskedTarget(target: THREE.WebGLRenderTarget, material: THREE.Material, samples: number, reference: number): THREE.WebGLRenderTarget {
  target.samples=samples; target.stencilBuffer=true; material.stencilWrite=true; material.stencilFunc=THREE.AlwaysStencilFunc; material.stencilRef=reference; material.stencilZPass=THREE.ReplaceStencilOp; return target;
}
