// Measure: CPU render submission. Write the functions, save, and run: npm run drill -- drills/2/gpu/measurement/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// Milliseconds spent in the CPU render call.
export function cpuRenderMs(renderer: Pick<THREE.WebGLRenderer, "render">, scene: THREE.Scene, camera: THREE.Camera, now: () => number): Answer<number> {
  return null;
}
