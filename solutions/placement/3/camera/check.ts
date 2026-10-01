// Reference placement answers.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function checkViewMatrix(camera: THREE.Camera, worldPoint: THREE.Vector3): Answer<THREE.Vector3> {
  camera.updateWorldMatrix(true,false);
  return worldPoint.clone().applyMatrix4(camera.matrixWorldInverse);
}

export function checkProjectionMatrix(verticalFov: number, width: number, height: number, near: number, far: number): Answer<THREE.Matrix4> {
  return new THREE.PerspectiveCamera(verticalFov,width/height,near,far).projectionMatrix.clone();
}

export function checkClipNdcScreen(ndc: THREE.Vector3, width: number, height: number): Answer<THREE.Vector3> {
  return new THREE.Vector3((ndc.x+1)*width/2,(1-ndc.y)*height/2,ndc.z);
}

export function checkProjectUnproject(camera: THREE.Camera, worldPoint: THREE.Vector3, width: number, height: number): Answer<THREE.Vector3> {
  camera.updateWorldMatrix(true,false);
  const ndc=worldPoint.clone().project(camera);
  return new THREE.Vector3((ndc.x+1)*width/2,(1-ndc.y)*height/2,ndc.z);
}

export function checkDepthPrecision(camera: THREE.PerspectiveCamera, viewDepth: number): Answer<number> {
  return (new THREE.Vector3(0,0,-viewDepth).applyMatrix4(camera.projectionMatrix).z+1)/2;
}

export function checkFrustum(camera: THREE.PerspectiveCamera, width: number, height: number, worldPoint: THREE.Vector3): Answer<boolean> {
  camera.aspect=width/height; camera.updateProjectionMatrix(); camera.updateWorldMatrix(true,false);
  const frustum=new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));
  return frustum.containsPoint(worldPoint);
}

export function checkAspectResize(camera: THREE.PerspectiveCamera, width: number, height: number): Answer<number> {
  camera.aspect=width/height; camera.updateProjectionMatrix(); return camera.aspect;
}

export function checkFitToBounds(radius: number, verticalFovDegrees: number, aspect: number): Answer<number> {
  const vertical=THREE.MathUtils.degToRad(verticalFovDegrees)/2;
  const horizontal=Math.atan(Math.tan(vertical)*aspect);
  return radius/Math.sin(Math.min(vertical,horizontal));
}

export function checkWorldSizePerPixel(depth: number, fov: number, height: number): Answer<number> {
  return 2*depth*Math.tan(THREE.MathUtils.degToRad(fov)/2)/height;
}

export function checkCameraRelative(camera: THREE.Camera): Answer<{ right: THREE.Vector3; up: THREE.Vector3; forward: THREE.Vector3 }> {
  camera.updateWorldMatrix(true,false);
  return { right:new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0).normalize(), up:new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,1).normalize(), forward:camera.getWorldDirection(new THREE.Vector3()) };
}
