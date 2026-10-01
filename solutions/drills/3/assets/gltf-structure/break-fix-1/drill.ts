import { Mesh, Object3D } from 'three';

export function primitiveMeshes(part: Object3D): Mesh[] {
  const meshes: Mesh[] = [];
  part.traverse((child) => { if (child instanceof Mesh) meshes.push(child); });
  return meshes;
}
