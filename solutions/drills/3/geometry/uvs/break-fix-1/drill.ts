// Reference repair for drills/3/geometry/uvs/break-fix-1.
import * as THREE from 'three';

export function tileFirstFace(geometry: THREE.BufferGeometry, offset: THREE.Vector2): THREE.BufferGeometry {
  const copy=geometry.index ? geometry.toNonIndexed() : geometry.clone();
  const uv=copy.getAttribute('uv');
  for(let i=0;i<3;i++) uv.setXY(i,uv.getX(i)+offset.x,uv.getY(i)+offset.y);
  copy.clearGroups();
  copy.addGroup(0,3,1);
  copy.addGroup(3,copy.getAttribute('position').count-3,0);
  return copy;
}
