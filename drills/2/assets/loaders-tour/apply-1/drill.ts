// Loaders: prepare and track an asset. Write the functions, save, and run: npm run drill -- drills/2/assets/loaders-tour/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// Whether a Draco decoder must be attached.
export function needsDraco(extensions: string[]): Answer<boolean> {
  return null;
}

// The current async load state.
export function loadState(completed: boolean, failed: boolean): Answer<'loading' | 'ready' | 'failed'> {
  return null;
}
