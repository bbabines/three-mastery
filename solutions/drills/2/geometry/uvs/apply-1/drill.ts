// Reference answer for drills/2/geometry/uvs/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function assignFaceUv(geometry: THREE.BufferGeometry, uv: THREE.Vector2): Answer<THREE.BufferGeometry> {
  const copy=geometry.clone(); const attr=copy.getAttribute('uv');
  for(let i=0;i<Math.min(3,attr.count);i++) attr.setXY(i,attr.getX(i)+uv.x,attr.getY(i)+uv.y);
  attr.needsUpdate=true;
  copy.clearGroups();
  copy.addGroup(0, 3, 1);
  return copy;
}
