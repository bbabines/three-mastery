// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function maskedTarget(target: THREE.WebGLRenderTarget, material: THREE.Material, samples: number, reference: number): THREE.WebGLRenderTarget {
  target.samples=samples; material.stencilWrite=true; return target;
}
