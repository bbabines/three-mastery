import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function assignFaceUv(geometry: THREE.BufferGeometry, uv: THREE.Vector2): Answer<THREE.BufferGeometry> {
  // An indexed corner may also belong to a later face. Give each face its own UV entries.
  const copy = geometry.index ? geometry.toNonIndexed() : geometry.clone();
  const attribute = copy.getAttribute('uv');
  for (let i = 0; i < 3; i++) {
    attribute.setXY(i, attribute.getX(i) + uv.x, attribute.getY(i) + uv.y);
  }
  attribute.needsUpdate = true;
  copy.clearGroups();
  copy.addGroup(0, 3, 1);
  const remaining = copy.getAttribute('position').count - 3;
  if (remaining > 0) copy.addGroup(3, remaining, 0);
  return copy;
}
