// Reference repair for drills/3/geometry/winding-order/break-fix-1.
import * as THREE from 'three';

export function flipFrontFace(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
  const copy=geometry.index ? geometry.toNonIndexed() : geometry.clone(); const p=copy.getAttribute('position');
  for(let i=0;i<p.count;i+=3){const b=new THREE.Vector3().fromBufferAttribute(p,i+1),c=new THREE.Vector3().fromBufferAttribute(p,i+2); p.setXYZ(i+1,c.x,c.y,c.z); p.setXYZ(i+2,b.x,b.y,b.z);} copy.computeVertexNormals(); return copy;
}
