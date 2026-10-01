// Reference repair for drills/3/geometry/face-normals/break-fix-1.
import * as THREE from 'three';

export function worldFaceNormal(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, matrixWorld: THREE.Matrix4): THREE.Vector3 {
  return THREE.Triangle.getNormal(a,b,c,new THREE.Vector3()).applyMatrix3(new THREE.Matrix3().getNormalMatrix(matrixWorld)).normalize();
}
