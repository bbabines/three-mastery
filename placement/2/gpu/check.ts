import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// 'Tour: renderer settings': The pixel ratio passed to WebGLRenderer.
export function capRendererDpr(renderer: Pick<THREE.WebGLRenderer, "setPixelRatio">, deviceDpr: number, cap: number): Answer<number> {
  return null;
}

// Pipeline stages: Counts of vertex invocations and fragment candidates.
export function stageWork(vertices: number, coveredSamples: number, passes: number): Answer<{ vertex: number; fragment: number }> {
  return null;
}

// Draw call anatomy: Estimated draw submissions across the main and shadow passes.
export function estimatedDraws(root: THREE.Object3D, shadowLights: number): Answer<number> {
  return null;
}

// State changes and sorting: The overlay renderOrder after setting it.
export function putOverlayLast(overlay: THREE.Object3D, order: number): Answer<number> {
  return null;
}

// Depth buffer and early-z: The material configured for opaque depth testing and writing.
export function opaqueOccluder(material: THREE.MeshBasicMaterial): Answer<THREE.MeshBasicMaterial> {
  return null;
}

// Stencil buffer: The material configured to write a stencil reference.
export function stencilWriter(material: THREE.Material, reference: number): Answer<THREE.Material> {
  return null;
}

// Blending and transparency: The blended, depth-tested, non-depth-writing material.
export function glassMaterial(material: THREE.MeshBasicMaterial, opacity: number): Answer<THREE.MeshBasicMaterial> {
  return null;
}

// Render targets: A thumbnail-sized offscreen render target.
export function thumbnailTarget(width: number, height: number): Answer<THREE.WebGLRenderTarget> {
  return null;
}

// Multi-pass and post-processing: The full-screen fragment candidates across the passes.
export function postFragments(width: number, height: number, passes: number): Answer<number> {
  return null;
}

// Multisampling: The multisampled offscreen target.
export function msaaTarget(width: number, height: number, samples: number): Answer<THREE.WebGLRenderTarget> {
  return null;
}

// Readback: The Promise for one RGBA picking pixel.
export function readIdPixel(renderer: Pick<THREE.WebGLRenderer, "readRenderTargetPixelsAsync">, target: THREE.WebGLRenderTarget, x: number, y: number): Answer<Promise<ArrayBufferView>> {
  return null;
}

// Frame budget: Milliseconds available for one frame.
export function budgetForHz(refreshHz: number): Answer<number> {
  return null;
}

// Measurement tools: Milliseconds spent in the CPU render call.
export function cpuRenderMs(renderer: Pick<THREE.WebGLRenderer, "render">, scene: THREE.Scene, camera: THREE.Camera, now: () => number): Answer<number> {
  return null;
}
