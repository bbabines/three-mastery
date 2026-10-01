// Reference repair for drills/3/camera/frustum/break-fix-1.
import * as THREE from 'three';

export function visibleAfterResize(camera: THREE.PerspectiveCamera, width: number, height: number, worldPoint: THREE.Vector3): boolean {
  camera.aspect=width/height; camera.updateProjectionMatrix(); camera.updateWorldMatrix(true,false);
  const f=new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));
  return f.containsPoint(worldPoint);
}
