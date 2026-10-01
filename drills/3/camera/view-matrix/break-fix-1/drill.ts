// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function worldToView(camera: THREE.Camera, worldPoint: THREE.Vector3): THREE.Vector3 {
  camera.updateWorldMatrix(true,false);
  return worldPoint.clone().applyMatrix4(camera.matrixWorld);
}
