// Undo a saved model-to-world transform so a world hit becomes a local point, preserving the saved matrix.
// Check with: npm run drill -- drills/2/transforms/inverse-matrices/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Undo a saved model-to-world transform so a world hit becomes a local point, preserving the saved matrix.
export function undoTransform(worldPoint: THREE.Vector3, modelToWorld: THREE.Matrix4): Answer<THREE.Vector3> {
  return null;
}
