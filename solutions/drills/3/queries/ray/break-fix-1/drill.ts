// Reference repair for drills/3/queries/ray/break-fix-1.
import * as THREE from 'three';

export function sphereEntry(ray: THREE.Ray, sphere: THREE.Sphere): THREE.Vector3 | null {
  return ray.intersectSphere(sphere,new THREE.Vector3());
}
