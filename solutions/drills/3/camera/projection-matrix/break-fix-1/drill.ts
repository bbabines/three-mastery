// Reference repair for drills/3/camera/projection-matrix/break-fix-1.
import * as THREE from 'three';

export function viewportLens(verticalFov: number, width: number, height: number, near: number, far: number): THREE.Matrix4 {
  return new THREE.PerspectiveCamera(verticalFov,width/height,near,far).projectionMatrix.clone();
}
