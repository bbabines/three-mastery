// Pipeline: count vertex and fragment work. Write the functions, save, and run: npm run drill -- drills/2/gpu/pipeline-stages/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// Counts of vertex invocations and fragment candidates.
export function stageWork(vertices: number, coveredSamples: number, passes: number): Answer<{ vertex: number; fragment: number }> {
  return { vertex: vertices * passes, fragment: coveredSamples * passes };
}
