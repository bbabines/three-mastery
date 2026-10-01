import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Triage: The first area to inspect from the probe evidence.
export function firstFailure(probe: { inScene: boolean; inView: boolean; hasVertices: boolean; hasMaterial: boolean; shaderLinked: boolean }): Answer<string> {
  if (!probe.inScene) return 'scene'; if (!probe.inView) return 'camera'; if (!probe.hasVertices) return 'geometry'; if (!probe.hasMaterial) return 'material'; if (!probe.shaderLinked) return 'pipeline'; return 'ready';
}

// Nothing-renders checklist: Whether the object world bounds touch the camera frustum.
export function inCameraView(object: THREE.Object3D, camera: THREE.Camera): Answer<boolean> {
  object.updateWorldMatrix(true,true); camera.updateMatrixWorld(); const frustum = new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse)); return frustum.intersectsBox(new THREE.Box3().setFromObject(object,true));
}

// Helpers: A BoxHelper that shows the object bounds.
export function boundsHelper(object: THREE.Object3D): Answer<THREE.BoxHelper> {
  object.updateWorldMatrix(true,true); return new THREE.BoxHelper(object);
}

// Visualizing vectors: The unit direction for a world-space ArrowHelper.
export function worldArrowDirection(object: THREE.Object3D, local: THREE.Vector3): Answer<THREE.Vector3> {
  object.updateWorldMatrix(true, false);
  return local.clone().transformDirection(object.matrixWorld);
}

// Reading matrices: The translation Vector3 encoded in the matrix.
export function matrixTranslation(matrix: THREE.Matrix4): Answer<THREE.Vector3> {
  return new THREE.Vector3().setFromMatrixPosition(matrix);
}

// NaN and degenerate cases: The unchanged finite vector or a zero-vector fallback.
export function finiteOrZero(vector: THREE.Vector3): Answer<THREE.Vector3> {
  return Number.isFinite(vector.x) && Number.isFinite(vector.y) && Number.isFinite(vector.z) ? vector.clone() : new THREE.Vector3();
}

// Isolation: The number of sibling branches hidden for isolation.
export function showOnlyBranch(root: THREE.Object3D, keep: THREE.Object3D): Answer<number> {
  let hidden=0; for (const child of root.children) { if (child!==keep) { child.visible=false; hidden++; } else child.visible=true; } return hidden;
}

// Frame capture: Draw calls and triangles recorded after a render.
export function captureFrameCounts(renderer: Pick<THREE.WebGLRenderer, "render" | "info">, scene: THREE.Scene, camera: THREE.Camera): Answer<{ calls: number; triangles: number }> {
  renderer.render(scene,camera); return {calls:renderer.info.render.calls,triangles:renderer.info.render.triangles};
}

// Shader errors: The authored shader line, or −1 when the log has no line.
export function authoredShaderLine(log: string, injectedLines: number): Answer<number> {
  const match=log.match(/ERROR:\s*\d+:(\d+)/); return match ? Math.max(1,Number(match[1])-injectedLines) : -1;
}

// Debug views: A material that reveals normals, depth, or mesh edges.
export function debugViewMaterial(view: "normal" | "depth" | "wireframe"): Answer<THREE.Material> {
  if (view==="normal") return new THREE.MeshNormalMaterial(); if (view==="depth") return new THREE.MeshDepthMaterial(); return new THREE.MeshBasicMaterial({wireframe:true});
}
