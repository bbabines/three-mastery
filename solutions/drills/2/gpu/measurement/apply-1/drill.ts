// Measure: compare one controlled change. Write the functions, save, and run: npm run drill -- drills/2/gpu/measurement/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// Saved frame milliseconds and percentage from baseline.
export function frameSaving(baselineMs: number, changedMs: number): Answer<{ ms: number; percent: number }> {
  const ms = baselineMs-changedMs; return {ms,percent:baselineMs===0?0:100*ms/baselineMs};
}
