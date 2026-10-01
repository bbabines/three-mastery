// Resolution and DPR: choose a safe pixel ratio for a renderer.
// Check it with: npm run drill -- drills/2/optimization/resolution-dpr/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';

// `deviceRatio` is window.devicePixelRatio; `cap` is at least 1.
// Return at least 1, no more than cap, and no more than a valid deviceRatio.
export function pixelRatioFor(deviceRatio: number, cap: number): Answer<number> {
  return null;
}
