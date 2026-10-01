// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function selectableBoxHit(ray: THREE.Ray, parts: THREE.Object3D[]): THREE.Object3D | null {
  let best:THREE.Object3D|null=null, distance=Infinity; for(const part of parts){const hit=ray.intersectBox(part.userData.bounds as THREE.Box3,new THREE.Vector3()); if(hit){const d=hit.distanceTo(ray.origin); if(d<distance){distance=d;best=part;}}} return best;
}
