// Local vs world: the nearest bin. Write both functions, then save: the page's scene runs them.
// Check them with: npm run drill -- drills/2/transforms/local-vs-world/implement-1
//
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import { Object3D, Vector3 } from 'three';

// How far apart a and b really are, in the world. Each one's position is measured from its parent,
// and a parent may have moved since the last render. Don't move either.
export function worldGap(a: Object3D, b: Object3D): Answer<number> {
  return null;
}

// The number (index) of the bin in `bins` that's nearest the robot, in the world. Don't move anything.
export function nearestBin(robot: Object3D, bins: Object3D[]): Answer<number> {
  return null;
}
