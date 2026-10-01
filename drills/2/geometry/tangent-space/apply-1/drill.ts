// Convert a DirectX-style −Y normal-map sample to the +Y convention used by three.js and glTF.
// Check with: npm run drill -- drills/2/geometry/tangent-space/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Convert a DirectX-style −Y normal-map sample to the +Y convention used by three.js and glTF.
export function flipNormalGreen(sample: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}
