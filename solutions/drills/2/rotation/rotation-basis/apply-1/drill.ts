// Reference answer for drills/2/rotation/rotation-basis/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function cameraRight(camera: THREE.Camera): Answer<THREE.Vector3> {
  camera.updateWorldMatrix(true,false);
  return new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0).normalize();
}
