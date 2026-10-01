// Reference repair for drills/3/camera/camera-relative/break-fix-1.
import * as THREE from 'three';

export function cameraRight(camera: THREE.Camera): THREE.Vector3 {
  camera.updateWorldMatrix(true,false); return new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0).normalize();
}
