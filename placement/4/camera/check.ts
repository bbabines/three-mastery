// No docs. Write each small judgment check, then run npm run pick -- done once.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// view-matrix: Find a world's point in camera space.
export function viewPoint(camera: THREE.Camera, world: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}

// projection-matrix: Apply the camera's projection matrix to a view-space point.
export function projectedPoint(camera: THREE.PerspectiveCamera, viewPoint: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}

// clip-ndc-screen: Map NDC into canvas pixels from top left.
export function screenPosition(ndc: THREE.Vector3, width: number, height: number): Answer<THREE.Vector2> {
  return null;
}

// project-unproject: Project a world point into normalized device coordinates.
export function ndcOf(camera: THREE.PerspectiveCamera, point: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}

// depth-precision: Judge the near-to-far range that consumes depth precision.
export function depthRatio(near: number, far: number): Answer<number> {
  return null;
}

// frustum: Test whether a world point is inside the camera frustum.
export function inCameraFrustum(camera: THREE.PerspectiveCamera, point: THREE.Vector3): Answer<boolean> {
  return null;
}

// aspect-resize: Update aspect and projection after a canvas resize.
export function resizeCamera(camera: THREE.PerspectiveCamera, width: number, height: number): Answer<number> {
  return null;
}

// fit-to-bounds: Find the world center of nested geometry for a camera fit.
export function boundsCenter(object: THREE.Object3D): Answer<THREE.Vector3> {
  return null;
}

// world-size-per-pixel: Find world height represented by one pixel at a view depth.
export function unitsPerPixel(camera: THREE.PerspectiveCamera, depth: number, canvasHeight: number): Answer<number> {
  return null;
}

// camera-relative: Find screen-right as a world direction.
export function cameraRight(camera: THREE.Camera): Answer<THREE.Vector3> {
  return null;
}
