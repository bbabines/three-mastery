// Reference repair for drills/3/queries/filtering/break-fix-1.
import * as THREE from 'three';

export function selectableBoxHit(ray: THREE.Ray, parts: THREE.Object3D[]): THREE.Object3D | null {
  let best:THREE.Object3D|null=null, distance=Infinity; for(const part of parts){if(!part.userData.selectable)continue; const hit=ray.intersectBox(part.userData.bounds as THREE.Box3,new THREE.Vector3()); if(hit){const d=hit.distanceTo(ray.origin); if(d<distance){distance=d;best=part;}}} return best;
}
