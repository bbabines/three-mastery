// Stencil and MSAA: configure an offscreen pass. Write the functions, save, and run: npm run drill -- drills/2/gpu/stencil/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The material configured to write a stencil reference.
export function stencilWriter(material: THREE.Material, reference: number): Answer<THREE.Material> {
  return null;
}

// The multisampled offscreen target.
export function msaaTarget(width: number, height: number, samples: number): Answer<THREE.WebGLRenderTarget> {
  return null;
}
