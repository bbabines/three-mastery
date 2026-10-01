// Reference answer for drills/2/geometry/face-normals/implement-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function faceNormalWorld(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, modelToWorld: THREE.Matrix4): Answer<THREE.Vector3> {
  return THREE.Triangle.getNormal(a,b,c,new THREE.Vector3()).applyMatrix3(new THREE.Matrix3().getNormalMatrix(modelToWorld)).normalize();
}
