// No docs. Write each small judgment check, then run npm run pick -- done once.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// triage: Choose the first fault bucket from simple evidence.
export function firstBucket(visibleGeometry: boolean, lit: boolean, inFrustum: boolean): Answer<'geometry' | 'material' | 'camera' | 'pipeline'> {
  return null;
}

// nothing-renders: Check whether a point is inside the camera frustum.
export function cameraSeesPoint(camera: THREE.PerspectiveCamera, point: THREE.Vector3): Answer<boolean> {
  return null;
}

// helpers: Place visible axes at a suspect world point.
export function axesAt(point: THREE.Vector3, size: number): Answer<THREE.AxesHelper> {
  return null;
}

// visualizing-vectors: Draw a direction arrow from a world origin.
export function directionArrow(origin: THREE.Vector3, direction: THREE.Vector3): Answer<THREE.ArrowHelper> {
  return null;
}

// reading-matrices: Read translation from a transform matrix.
export function translationFromMatrix(matrix: THREE.Matrix4): Answer<THREE.Vector3> {
  return null;
}

// nan-degenerate: Reject a point containing NaN or infinity.
export function finitePoint(point: THREE.Vector3): Answer<boolean> {
  return null;
}

// isolation: Replace a suspect material with a known unlit one.
export function simpleMaterial(mesh: THREE.Mesh): Answer<THREE.Material | THREE.Material[]> {
  return null;
}

// frame-capture: Decide whether unexpected pass work needs a frame capture.
export function frameNeedsCapture(drawCalls: number, expectedCalls: number): Answer<boolean> {
  return null;
}

// shader-errors: Recognize a shader compile error in a driver log.
export function shaderFailed(log: string): Answer<boolean> {
  return null;
}

// debug-views: Use a view-space normal material to isolate geometry.
export function normalView(mesh: THREE.Mesh): Answer<THREE.Material | THREE.Material[]> {
  return null;
}
