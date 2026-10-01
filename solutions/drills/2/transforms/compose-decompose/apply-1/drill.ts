// Reference answer for drills/2/transforms/compose-decompose/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function isMirroredPose(matrix: THREE.Matrix4): Answer<boolean> {
  const p = new THREE.Vector3(), q = new THREE.Quaternion(), s = new THREE.Vector3();
  matrix.decompose(p,q,s);
  return s.x * s.y * s.z < 0;
}
