import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function viewPoint(camera: THREE.Camera, world: THREE.Vector3): Answer<THREE.Vector3> {
  camera.updateMatrixWorld(true); return world.clone().applyMatrix4(camera.matrixWorldInverse);
}

export function projectedPoint(camera: THREE.PerspectiveCamera, viewPoint: THREE.Vector3): Answer<THREE.Vector3> {
  camera.updateProjectionMatrix(); return viewPoint.clone().applyMatrix4(camera.projectionMatrix);
}

export function screenPosition(ndc: THREE.Vector3, width: number, height: number): Answer<THREE.Vector2> {
  return new THREE.Vector2((ndc.x+1)*width/2,(1-ndc.y)*height/2);
}

export function ndcOf(camera: THREE.PerspectiveCamera, point: THREE.Vector3): Answer<THREE.Vector3> {
  camera.updateMatrixWorld(true); return point.clone().project(camera);
}

export function depthRatio(near: number, far: number): Answer<number> {
  return far/near;
}

export function inCameraFrustum(camera: THREE.PerspectiveCamera, point: THREE.Vector3): Answer<boolean> {
  camera.updateMatrixWorld(true); camera.updateProjectionMatrix(); return new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse)).containsPoint(point);
}

export function resizeCamera(camera: THREE.PerspectiveCamera, width: number, height: number): Answer<number> {
  camera.aspect=width/height; camera.updateProjectionMatrix(); return camera.aspect;
}

export function boundsCenter(object: THREE.Object3D): Answer<THREE.Vector3> {
  object.updateWorldMatrix(true,true); return new THREE.Box3().setFromObject(object,true).getCenter(new THREE.Vector3());
}

export function unitsPerPixel(camera: THREE.PerspectiveCamera, depth: number, canvasHeight: number): Answer<number> {
  return 2*depth*Math.tan(THREE.MathUtils.degToRad(camera.fov)/2)/canvasHeight;
}

export function cameraRight(camera: THREE.Camera): Answer<THREE.Vector3> {
  camera.updateMatrixWorld(true); return new THREE.Vector3(1,0,0).transformDirection(camera.matrixWorld);
}
