// Render only when needed, then adapt quality. Write the functions, save, and run: npm run drill -- drills/2/optimization/render-on-demand/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// Whether this frame needs rendering.
export function shouldDraw(changed: boolean, tabVisible: boolean): Answer<boolean> {
  return null;
}

// The next quality level from measured frame time.
export function qualityStep(level: number, frameMs: number, targetMs: number, bandMs: number): Answer<number> {
  return null;
}
