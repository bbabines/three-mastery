// Place a projected NDC point on a CSS pixel canvas, flipping the vertical direction to match the page.
// Check with: npm run drill -- drills/2/camera/clip-ndc-screen/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Place a projected NDC point on a CSS pixel canvas, flipping the vertical direction to match the page.
export function ndcToPixel(ndc: THREE.Vector3, width: number, height: number): Answer<THREE.Vector3> {
  return null;
}
