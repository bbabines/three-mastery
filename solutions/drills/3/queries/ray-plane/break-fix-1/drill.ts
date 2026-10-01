// Reference repair for drills/3/queries/ray-plane/break-fix-1.
import * as THREE from 'three';

export function planeHit(ray: THREE.Ray, plane: THREE.Plane): THREE.Vector3 | null {
  return ray.intersectPlane(plane,new THREE.Vector3());
}
