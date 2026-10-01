import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function reverseWinding(geometry: THREE.BufferGeometry): Answer<THREE.BufferGeometry> {
  const copy = geometry.clone();
  if (copy.index) {
    const index = copy.index;
    for (let i = 0; i < index.count; i += 3) {
      const second = index.getX(i + 1);
      index.setX(i + 1, index.getX(i + 2));
      index.setX(i + 2, second);
    }
    index.needsUpdate = true;
  } else {
    // In a nonindexed mesh, every attribute entry belongs to one corner.
    for (const attribute of Object.values(copy.attributes)) {
      for (let i = 0; i < attribute.count; i += 3) {
        for (let component = 0; component < attribute.itemSize; component++) {
          const second = attribute.getComponent(i + 1, component);
          attribute.setComponent(i + 1, component, attribute.getComponent(i + 2, component));
          attribute.setComponent(i + 2, component, second);
        }
      }
      attribute.needsUpdate = true;
    }
  }
  const normal = copy.getAttribute('normal');
  if (normal) {
    for (let i = 0; i < normal.count; i++) {
      normal.setXYZ(i, -normal.getX(i), -normal.getY(i), -normal.getZ(i));
    }
    normal.needsUpdate = true;
  }
  return copy;
}
