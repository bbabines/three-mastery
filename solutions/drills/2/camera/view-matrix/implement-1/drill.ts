// Reference answer for drills/2/camera/view-matrix/implement-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function worldToView(camera: THREE.Camera, worldPoint: THREE.Vector3): Answer<THREE.Vector3> {
  camera.updateWorldMatrix(true,false);
  return worldPoint.clone().applyMatrix4(camera.matrixWorldInverse);
}
