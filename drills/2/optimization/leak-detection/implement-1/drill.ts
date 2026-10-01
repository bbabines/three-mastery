// Leak check: measure a swap cycle. Write the functions, save, and run: npm run drill -- drills/2/optimization/leak-detection/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The change in GPU geometry and texture counts after swaps.
export function swapMemoryDelta(renderer: Pick<THREE.WebGLRenderer, "render" | "info">, scene: THREE.Scene, camera: THREE.Camera, swap: () => void, cycles: number): Answer<{ geometries: number; textures: number }> {
  return null;
}
