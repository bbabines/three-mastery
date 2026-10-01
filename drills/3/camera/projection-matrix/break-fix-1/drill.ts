// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function viewportLens(verticalFov: number, width: number, height: number, near: number, far: number): THREE.Matrix4 {
  return new THREE.PerspectiveCamera(verticalFov,height/width,near,far).projectionMatrix.clone();
}
