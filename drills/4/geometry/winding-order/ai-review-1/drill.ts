import { BufferGeometry, Matrix4 } from 'three';
export function bakeTransform(geometry: BufferGeometry, transform: Matrix4): BufferGeometry {
  return geometry.clone().applyMatrix4(transform);
}
