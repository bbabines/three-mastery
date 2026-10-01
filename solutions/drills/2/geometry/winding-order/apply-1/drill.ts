// Reference answer for drills/2/geometry/winding-order/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function reverseWinding(geometry: THREE.BufferGeometry): Answer<THREE.BufferGeometry> {
  const copy=geometry.clone();
  const index=copy.index;
  if(index) { for(let i=0;i<index.count;i+=3) { const b=index.getX(i+1); index.setX(i+1,index.getX(i+2)); index.setX(i+2,b); } index.needsUpdate=true; }
  else { const p=copy.getAttribute('position'); for(let i=0;i<p.count;i+=3) { const b=new THREE.Vector3().fromBufferAttribute(p,i+1); const c=new THREE.Vector3().fromBufferAttribute(p,i+2); p.setXYZ(i+1,c.x,c.y,c.z); p.setXYZ(i+2,b.x,b.y,b.z); } p.needsUpdate=true; }
  return copy;
}
