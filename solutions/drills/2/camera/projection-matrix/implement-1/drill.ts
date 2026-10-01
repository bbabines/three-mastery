// Reference answer for drills/2/camera/projection-matrix/implement-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function lensForViewport(verticalFov: number, width: number, height: number, near: number, far: number): Answer<THREE.Matrix4> {
  return new THREE.PerspectiveCamera(verticalFov,width/height,near,far).projectionMatrix.clone();
}
