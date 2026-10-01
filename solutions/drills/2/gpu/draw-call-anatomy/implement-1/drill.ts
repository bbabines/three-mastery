// Draw calls: estimate scene submissions. Write the functions, save, and run: npm run drill -- drills/2/gpu/draw-call-anatomy/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// Estimated draw submissions across the main and shadow passes.
export function estimatedDraws(root: THREE.Object3D, shadowLights: number): Answer<number> {
  let draws = 0; root.traverseVisible((child) => { if (!(child instanceof THREE.Mesh)) return; const pieces = Array.isArray(child.material) && child.geometry.groups.length ? child.geometry.groups.length : 1; draws += pieces; if (child.castShadow) draws += pieces*shadowLights; }); return draws;
}
