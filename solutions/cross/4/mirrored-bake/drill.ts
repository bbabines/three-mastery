import type { Answer } from '@harness/drill';
import { BufferGeometry, Matrix4 } from 'three';

export function bakeMirror(geometry: BufferGeometry, transform: Matrix4): Answer<BufferGeometry> {
  const copy = geometry.clone().applyMatrix4(transform);
  if (transform.determinant() >= 0) return copy;
  if (copy.index) {
    for (let i = 0; i < copy.index.count; i += 3) {
      const second = copy.index.getX(i + 1);
      copy.index.setX(i + 1, copy.index.getX(i + 2));
      copy.index.setX(i + 2, second);
    }
    copy.index.needsUpdate = true;
  } else {
    for (const attribute of Object.values(copy.attributes)) {
      for (let i = 0; i < attribute.count; i += 3) {
        for (let c = 0; c < attribute.itemSize; c++) {
          const second = attribute.getComponent(i + 1, c);
          attribute.setComponent(i + 1, c, attribute.getComponent(i + 2, c));
          attribute.setComponent(i + 2, c, second);
        }
      }
      attribute.needsUpdate = true;
    }
  }
  return copy;
}
