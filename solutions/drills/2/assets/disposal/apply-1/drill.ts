// Dispose: remove a retired variant. Write the functions, save, and run: npm run drill -- drills/2/assets/disposal/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The number of no-longer-used geometry and material resources disposed.
export function retireVariant(root: THREE.Object3D, retired: THREE.Mesh): Answer<number> {
  retired.removeFromParent();
  const used = new Set<THREE.Material | THREE.BufferGeometry>();
  root.traverse((child) => { if (child instanceof THREE.Mesh) { used.add(child.geometry); for (const material of Array.isArray(child.material) ? child.material : [child.material]) used.add(material); } });
  let count = 0; for (const resource of new Set<THREE.Material | THREE.BufferGeometry>([retired.geometry, ...(Array.isArray(retired.material) ? retired.material : [retired.material])])) if (!used.has(resource)) { resource.dispose(); count++; }
  return count;
}
