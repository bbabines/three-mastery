// Controls: update and dolly. Write the functions, save, and run: npm run drill -- drills/2/interaction/controls-tour/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// Whether to call controls.update on the next frame.
export function needsControlsUpdate(dampingEnabled: boolean, moved: boolean): Answer<boolean> {
  return dampingEnabled || moved;
}

// Which camera value the dolly gesture changes.
export function dollyChanges(camera: THREE.Camera): Answer<'distance' | 'zoom'> {
  return camera instanceof THREE.OrthographicCamera ? 'zoom' : 'distance';
}
