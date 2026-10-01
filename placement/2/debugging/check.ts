import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Triage: The first area to inspect from the probe evidence.
export function firstFailure(probe: { inScene: boolean; inView: boolean; hasVertices: boolean; hasMaterial: boolean; shaderLinked: boolean }): Answer<string> {
  return null;
}

// Nothing-renders checklist: Whether the object world bounds touch the camera frustum.
export function inCameraView(object: THREE.Object3D, camera: THREE.Camera): Answer<boolean> {
  return null;
}

// Helpers: A BoxHelper that shows the object bounds.
export function boundsHelper(object: THREE.Object3D): Answer<THREE.BoxHelper> {
  return null;
}

// Visualizing vectors: The unit direction for a world-space ArrowHelper.
export function worldArrowDirection(object: THREE.Object3D, local: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}

// Reading matrices: The translation Vector3 encoded in the matrix.
export function matrixTranslation(matrix: THREE.Matrix4): Answer<THREE.Vector3> {
  return null;
}

// NaN and degenerate cases: The unchanged finite vector or a zero-vector fallback.
export function finiteOrZero(vector: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}

// Isolation: The number of sibling branches hidden for isolation.
export function showOnlyBranch(root: THREE.Object3D, keep: THREE.Object3D): Answer<number> {
  return null;
}

// Frame capture: Draw calls and triangles recorded after a render.
export function captureFrameCounts(renderer: Pick<THREE.WebGLRenderer, "render" | "info">, scene: THREE.Scene, camera: THREE.Camera): Answer<{ calls: number; triangles: number }> {
  return null;
}

// Shader errors: The authored shader line, or −1 when the log has no line.
export function authoredShaderLine(log: string, injectedLines: number): Answer<number> {
  return null;
}

// Debug views: A material that reveals normals, depth, or mesh edges.
export function debugViewMaterial(view: "normal" | "depth" | "wireframe"): Answer<THREE.Material> {
  return null;
}
