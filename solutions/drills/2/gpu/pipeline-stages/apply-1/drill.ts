// Pipeline: account for discarded fragments. Write the functions, save, and run: npm run drill -- drills/2/gpu/pipeline-stages/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// Candidate and surviving fragment counts.
export function fragmentOutcome(candidates: number, discarded: number, depthFailed: number): Answer<{ candidates: number; written: number }> {
  return { candidates, written: Math.max(0,candidates-discarded-depthFailed) };
}
