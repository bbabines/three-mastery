// Draw calls: instance repeated hardware. Write the functions, save, and run: npm run drill -- drills/2/optimization/draw-call-reduction/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// One InstancedMesh carrying each copy transform.
export function instanceHardware(geometry: THREE.BufferGeometry, material: THREE.Material, placements: THREE.Matrix4[]): Answer<THREE.InstancedMesh> {
  return null;
}
