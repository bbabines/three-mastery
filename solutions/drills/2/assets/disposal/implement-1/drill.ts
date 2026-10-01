// Dispose: release only owned resources. Write the functions, save, and run: npm run drill -- drills/2/assets/disposal/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The number of unique owned resources disposed.
export function disposeMeshOwned(mesh: THREE.Mesh, shared: Set<THREE.Material | THREE.BufferGeometry | THREE.Texture>): Answer<number> {
  const resources = new Set<THREE.Material | THREE.BufferGeometry | THREE.Texture>([mesh.geometry]);
  for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) { resources.add(material); for (const value of Object.values(material)) if (value instanceof THREE.Texture) resources.add(value); }
  let count = 0; for (const resource of resources) if (!shared.has(resource)) { resource.dispose(); count++; }
  return count;
}
