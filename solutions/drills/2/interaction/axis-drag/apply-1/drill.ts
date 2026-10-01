// Axis drag: move a child on its parent rail. Write the functions, save, and run: npm run drill -- drills/2/interaction/axis-drag/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The new child position in its parent's space.
export function childRailPosition(child: THREE.Object3D, worldDrag: THREE.Vector3, worldAxis: THREE.Vector3): Answer<THREE.Vector3> {
  child.updateWorldMatrix(true,false);
  const target = child.getWorldPosition(new THREE.Vector3()).add(worldDrag.clone().projectOnVector(worldAxis));
  return child.parent ? child.parent.worldToLocal(target) : target;
}
