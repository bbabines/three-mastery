// Memory: count geometry arrays. Write the functions, save, and run: npm run drill -- drills/2/assets/memory-math/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The total bytes of unique attribute and index arrays.
export function geometryArrayBytes(geometry: THREE.BufferGeometry): Answer<number> {
  const arrays = new Set<ArrayBufferView>();
  if (geometry.index) arrays.add(geometry.index.array);
  for (const attribute of Object.values(geometry.attributes)) arrays.add(attribute instanceof THREE.InterleavedBufferAttribute ? attribute.data.array : attribute.array);
  return [...arrays].reduce((sum, array) => sum + array.byteLength, 0);
}
