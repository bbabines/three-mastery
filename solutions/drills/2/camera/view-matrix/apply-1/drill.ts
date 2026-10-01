// Reference answer for drills/2/camera/view-matrix/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function viewDepth(camera: THREE.Camera, worldPoint: THREE.Vector3): Answer<number> {
  camera.updateWorldMatrix(true,false);
  return -worldPoint.clone().applyMatrix4(camera.matrixWorldInverse).z;
}
