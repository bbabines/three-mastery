// Pointer: a click or a drag. Write the functions, save, and run: npm run drill -- drills/2/interaction/pointer-events/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// Canvas-relative normalized coordinates.
export function canvasNdc(clientX: number, clientY: number, rect: { left: number; top: number; width: number; height: number }): Answer<THREE.Vector2> {
  return new THREE.Vector2(((clientX - rect.left) / rect.width) * 2 - 1, 1 - ((clientY - rect.top) / rect.height) * 2);
}

// Whether movement exceeded the drag threshold.
export function wasDrag(down: THREE.Vector2, up: THREE.Vector2, thresholdCssPx: number): Answer<boolean> {
  return down.distanceTo(up) > thresholdCssPx;
}
