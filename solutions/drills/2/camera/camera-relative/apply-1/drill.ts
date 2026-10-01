// Reference answer for drills/2/camera/camera-relative/apply-1.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function screenAxes(camera: THREE.Camera): Answer<{ right: THREE.Vector3; up: THREE.Vector3; forward: THREE.Vector3 }> {
  camera.updateWorldMatrix(true,false);
  return { right:new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0).normalize(), up:new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,1).normalize(), forward:camera.getWorldDirection(new THREE.Vector3()) };
}
