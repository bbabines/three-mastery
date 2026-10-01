// Imported glTF part material audit: fix the one-level collector.
import { Mesh, Object3D } from 'three';

export function primitiveMeshes(part: Object3D): Mesh[] {
  return part.children.filter((child): child is Mesh => child instanceof Mesh);
}
