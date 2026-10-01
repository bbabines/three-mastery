// Reference answer for drills/2/camera/frustum/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function visibleAfterResize(camera: THREE.PerspectiveCamera, width: number, height: number, worldPoint: THREE.Vector3): Answer<boolean> {
  camera.aspect=width/height; camera.updateProjectionMatrix(); camera.updateWorldMatrix(true,false);
  const frustum=new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));
  return frustum.containsPoint(worldPoint);
}
