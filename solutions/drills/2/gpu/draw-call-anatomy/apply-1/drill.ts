// Draw calls: read the renderer's count. Write the functions, save, and run: npm run drill -- drills/2/gpu/draw-call-anatomy/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The renderer.info draw call count after a render.
export function renderCallCount(renderer: Pick<THREE.WebGLRenderer, "render" | "info">, scene: THREE.Scene, camera: THREE.Camera): Answer<number> {
  renderer.render(scene,camera); return renderer.info.render.calls;
}
