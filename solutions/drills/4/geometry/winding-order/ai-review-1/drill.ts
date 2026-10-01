import { BufferGeometry, Matrix4 } from 'three';
export function bakeTransform(geometry: BufferGeometry, transform: Matrix4): BufferGeometry {
  const result = geometry.clone().applyMatrix4(transform);
  const index = result.index;
  if (transform.determinant() < 0 && index) {
    for (let i = 0; i < index.count; i += 3) {
      const second = index.getX(i + 1);
      index.setX(i + 1, index.getX(i + 2));
      index.setX(i + 2, second);
    }
    index.needsUpdate = true;
  }
  return result;
}
