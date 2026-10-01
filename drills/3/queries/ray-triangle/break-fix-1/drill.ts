// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function uvAtHit(ray: THREE.Ray, a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, uva: THREE.Vector2, uvb: THREE.Vector2, uvc: THREE.Vector2): THREE.Vector2 | null {
  const hit=ray.intersectTriangle(a,b,c,false,new THREE.Vector3()); if(!hit)return null; return uva.clone();
}
