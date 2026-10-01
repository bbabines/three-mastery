// Reference repair for drills/3/camera/view-matrix/break-fix-1.
import * as THREE from 'three';

export function worldToView(camera: THREE.Camera, worldPoint: THREE.Vector3): THREE.Vector3 {
  camera.updateWorldMatrix(true,false);
  return worldPoint.clone().applyMatrix4(camera.matrixWorldInverse);
}
