// Renderer: pixel ratio and ordering. Write the functions, save, and run: npm run drill -- drills/2/gpu/renderer-tour/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The pixel ratio passed to WebGLRenderer.
export function capRendererDpr(renderer: Pick<THREE.WebGLRenderer, "setPixelRatio">, deviceDpr: number, cap: number): Answer<number> {
  const applied = Math.min(deviceDpr,cap); renderer.setPixelRatio(applied); return applied;
}

// The overlay renderOrder after setting it.
export function putOverlayLast(overlay: THREE.Object3D, order: number): Answer<number> {
  overlay.renderOrder = order; return overlay.renderOrder;
}
