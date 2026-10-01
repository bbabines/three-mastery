// Reference repair for drills/3/queries/ray-triangle/break-fix-1.
import * as THREE from 'three';

export function uvAtHit(ray: THREE.Ray, a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, uva: THREE.Vector2, uvb: THREE.Vector2, uvc: THREE.Vector2): THREE.Vector2 | null {
  const hit=ray.intersectTriangle(a,b,c,false,new THREE.Vector3()); if(!hit)return null;
  const w=THREE.Triangle.getBarycoord(hit,a,b,c,new THREE.Vector3())!;
  return uva.clone().multiplyScalar(w.x).addScaledVector(uvb,w.y).addScaledVector(uvc,w.z);
}
