// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function rotatedBoxHit(ray: THREE.Ray, localBox: THREE.Box3, boxToWorld: THREE.Matrix4): THREE.Vector3 | null {
  return ray.intersectBox(localBox,new THREE.Vector3());
}
