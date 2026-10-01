// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function sphereEntry(ray: THREE.Ray, sphere: THREE.Sphere): THREE.Vector3 | null {
  return ray.intersectsSphere(sphere)?ray.origin.clone():null;
}
