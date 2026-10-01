import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function firstBucket(visibleGeometry: boolean, lit: boolean, inFrustum: boolean): Answer<'geometry' | 'material' | 'camera' | 'pipeline'> {
  return !visibleGeometry?'geometry':!inFrustum?'camera':!lit?'material':'pipeline';
}

export function cameraSeesPoint(camera: THREE.PerspectiveCamera, point: THREE.Vector3): Answer<boolean> {
  camera.updateMatrixWorld(true); return new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse)).containsPoint(point);
}

export function axesAt(point: THREE.Vector3, size: number): Answer<THREE.AxesHelper> {
  const helper=new THREE.AxesHelper(size); helper.position.copy(point); return helper;
}

export function directionArrow(origin: THREE.Vector3, direction: THREE.Vector3): Answer<THREE.ArrowHelper> {
  return new THREE.ArrowHelper(direction.clone().normalize(),origin.clone(),direction.length());
}

export function translationFromMatrix(matrix: THREE.Matrix4): Answer<THREE.Vector3> {
  return new THREE.Vector3().setFromMatrixPosition(matrix);
}

export function finitePoint(point: THREE.Vector3): Answer<boolean> {
  return Number.isFinite(point.x)&&Number.isFinite(point.y)&&Number.isFinite(point.z);
}

export function simpleMaterial(mesh: THREE.Mesh): Answer<THREE.Material | THREE.Material[]> {
  const old=mesh.material; mesh.material=new THREE.MeshBasicMaterial({color:0xffffff}); return old;
}

export function frameNeedsCapture(drawCalls: number, expectedCalls: number): Answer<boolean> {
  return drawCalls>expectedCalls;
}

export function shaderFailed(log: string): Answer<boolean> {
  return /ERROR|compile failed/i.test(log);
}

export function normalView(mesh: THREE.Mesh): Answer<THREE.Material | THREE.Material[]> {
  const old=mesh.material; mesh.material=new THREE.MeshNormalMaterial(); return old;
}
