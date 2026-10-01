// Focus: center a camera move. Write the functions, save, and run: npm run drill -- drills/2/interaction/focus-on-object/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The world center of the full object bounds.
export function focusCenter(root: THREE.Object3D): Answer<THREE.Vector3> {
  root.updateMatrixWorld(true);
  return new THREE.Box3().setFromObject(root,true).getCenter(new THREE.Vector3());
}

// The clamped smoothstep fraction of the focus move.
export function focusEase(elapsed: number, duration: number): Answer<number> {
  return THREE.MathUtils.smoothstep(elapsed,0,duration);
}
