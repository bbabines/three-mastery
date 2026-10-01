// Pointer ray: pick a part. Write the functions, save, and run: npm run drill -- drills/2/queries/ray-from-pointer/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The nearest hit Mesh name, or an empty string.
export function pickName(ndc: THREE.Vector2, camera: THREE.Camera, root: THREE.Object3D): Answer<string> {
  const caster = new THREE.Raycaster();
  caster.setFromCamera(ndc, camera);
  return caster.intersectObject(root, true)[0]?.object.name ?? '';
}
