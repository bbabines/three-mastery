// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function planeHit(ray: THREE.Ray, plane: THREE.Plane): THREE.Vector3 | null {
  return plane.projectPoint(ray.origin,new THREE.Vector3());
}
