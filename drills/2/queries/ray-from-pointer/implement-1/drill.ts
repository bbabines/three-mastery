// Pointer ray: canvas coordinates. Write the functions, save, and run: npm run drill -- drills/2/queries/ray-from-pointer/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The pointer as canvas-relative NDC.
export function pointerNdc(clientX: number, clientY: number, rect: { left: number; top: number; width: number; height: number }): Answer<THREE.Vector2> {
  return null;
}
