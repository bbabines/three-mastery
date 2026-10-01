// Scene audit: count shared data and visibility. Write the functions, save, and run: npm run drill -- drills/2/scene-graph/scene-stats/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The number of distinct mesh geometry resources.
export function uniqueGeometryCount(root: THREE.Object3D): Answer<number> {
  const ids = new Set<string>();
  root.traverse((child) => { if (child instanceof THREE.Mesh) ids.add(child.geometry.uuid); });
  return ids.size;
}

// Whether the object is visible through its parents and camera layer.
export function rendersForCamera(mesh: THREE.Object3D, camera: THREE.Camera): Answer<boolean> {
  if (!camera.layers.test(mesh.layers)) return false;
  for (let current: THREE.Object3D | null = mesh; current; current = current.parent) if (!current.visible) return false;
  return true;
}
