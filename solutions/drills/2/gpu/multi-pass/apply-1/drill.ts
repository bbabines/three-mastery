// Post: finish with output conversion. Write the functions, save, and run: npm run drill -- drills/2/gpu/multi-pass/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// Effect passes followed by exactly one final output pass.
export function outputLast(passes: string[]): Answer<string[]> {
  return [...passes.filter((name) => name !== 'output'),'output'];
}
