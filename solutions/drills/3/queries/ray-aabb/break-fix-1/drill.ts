// Reference repair for drills/3/queries/ray-aabb/break-fix-1.
import * as THREE from 'three';

export function rotatedBoxHit(ray: THREE.Ray, localBox: THREE.Box3, boxToWorld: THREE.Matrix4): THREE.Vector3 | null {
  const inverse=boxToWorld.clone().invert(); const localRay=ray.clone().applyMatrix4(inverse); const hit=localRay.intersectBox(localBox,new THREE.Vector3()); return hit?hit.applyMatrix4(boxToWorld):null;
}
