import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Traverse variants: The Mesh objects in visible branches.
export function visibleMeshes(root: THREE.Object3D): Answer<THREE.Mesh[]> {
  const found: THREE.Mesh[] = [];
  root.traverseVisible((child) => { if (child instanceof THREE.Mesh) found.push(child); });
  return found;
}

// Finding objects: All meshes with that name, even when names repeat.
export function namedMeshes(root: THREE.Object3D, name: string): Answer<THREE.Mesh[]> {
  const found: THREE.Mesh[] = [];
  root.traverse((child) => { if (child instanceof THREE.Mesh && child.name === name) found.push(child); });
  return found;
}

// Safe mutation: How many helper objects were removed.
export function removeTaggedHelpers(root: THREE.Object3D): Answer<number> {
  const helpers: THREE.Object3D[] = [];
  root.traverse((child) => { if (child.userData.helper === true) helpers.push(child); });
  for (const helper of helpers) helper.removeFromParent();
  return helpers.length;
}

// World-space bounds: The tight world-space size as a Vector3.
export function tightWorldSize(root: THREE.Object3D): Answer<THREE.Vector3> {
  root.updateMatrixWorld(true);
  return new THREE.Box3().setFromObject(root, true).getSize(new THREE.Vector3());
}

// Scene statistics: The number of distinct mesh geometry resources.
export function uniqueGeometryCount(root: THREE.Object3D): Answer<number> {
  const ids = new Set<string>();
  root.traverse((child) => { if (child instanceof THREE.Mesh) ids.add(child.geometry.uuid); });
  return ids.size;
}

// Visibility, removal, layers: Whether the object is visible through its parents and camera layer.
export function rendersForCamera(mesh: THREE.Object3D, camera: THREE.Camera): Answer<boolean> {
  if (!camera.layers.test(mesh.layers)) return false;
  for (let current: THREE.Object3D | null = mesh; current; current = current.parent) if (!current.visible) return false;
  return true;
}

// userData and metadata: The nearest selectable ID, or an empty string.
export function selectableId(hit: THREE.Object3D): Answer<string> {
  for (let current: THREE.Object3D | null = hit; current; current = current.parent) { if (typeof current.userData.selectableId === 'string') return current.userData.selectableId; }
  return '';
}

// Material override and restore: The original material, while the mesh receives the replacement.
export function swapMaterial(mesh: THREE.Mesh, replacement: THREE.Material): Answer<THREE.Material> {
  const original = mesh.material as THREE.Material;
  mesh.material = replacement;
  return original;
}

// Clone semantics: A colored clone with shared geometry and independent material.
export function coloredClone(source: THREE.Mesh, color: THREE.ColorRepresentation): Answer<THREE.Mesh> {
  const clone = source.clone();
  clone.material = (source.material as THREE.MeshStandardMaterial).clone();
  (clone.material as THREE.MeshStandardMaterial).color.set(color);
  return clone;
}
