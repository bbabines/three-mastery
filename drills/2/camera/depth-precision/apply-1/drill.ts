// Compare depth separation at a distant surface before and after moving the near plane outward.
// Check with: npm run drill -- drills/2/camera/depth-precision/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Compare depth separation at a distant surface before and after moving the near plane outward.
export function nearPlaneGain(viewDepth: number, oldNear: number, newNear: number, far: number): Answer<number> {
  return null;
}
