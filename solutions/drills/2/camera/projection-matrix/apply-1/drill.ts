// Reference answer for drills/2/camera/projection-matrix/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function orthoForBox(left: number, right: number, top: number, bottom: number, near: number, far: number): Answer<THREE.Matrix4> {
  return new THREE.OrthographicCamera(left,right,top,bottom,near,far).projectionMatrix.clone();
}
