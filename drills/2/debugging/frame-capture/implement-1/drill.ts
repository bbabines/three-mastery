// Frame capture: record draw evidence. Write the functions, save, and run: npm run drill -- drills/2/debugging/frame-capture/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// Draw calls and triangles recorded after a render.
export function captureFrameCounts(renderer: Pick<THREE.WebGLRenderer, "render" | "info">, scene: THREE.Scene, camera: THREE.Camera): Answer<{ calls: number; triangles: number }> {
  return null;
}
