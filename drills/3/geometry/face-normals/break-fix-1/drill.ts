// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function worldFaceNormal(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, matrixWorld: THREE.Matrix4): THREE.Vector3 {
  return THREE.Triangle.getNormal(a,b,c,new THREE.Vector3()).transformDirection(matrixWorld);
}
