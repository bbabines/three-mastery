// Selection: state and control ownership. Write the functions, save, and run: npm run drill -- drills/2/interaction/hover-selection/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The visual state with selection taking priority.
export function partState(selected: boolean, hovered: boolean): Answer<'selected' | 'hover' | 'none'> {
  return null;
}

// Whether orbit is enabled after the drag state is applied.
export function setOrbitDragState(controls: { enabled: boolean }, dragging: boolean): Answer<boolean> {
  return null;
}
