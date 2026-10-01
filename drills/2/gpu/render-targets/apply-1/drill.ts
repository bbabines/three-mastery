// Render target: a GPU picking buffer. Write the functions, save, and run: npm run drill -- drills/2/gpu/render-targets/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// A nearest-filtered, unsampled GPU picking target.
export function pickingTarget(width: number, height: number): Answer<THREE.WebGLRenderTarget> {
  return null;
}
