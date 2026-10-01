import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// 'Tour: renderer settings': The pixel ratio passed to WebGLRenderer.
export function capRendererDpr(renderer: Pick<THREE.WebGLRenderer, "setPixelRatio">, deviceDpr: number, cap: number): Answer<number> {
  const applied = Math.min(deviceDpr,cap); renderer.setPixelRatio(applied); return applied;
}

// Pipeline stages: Counts of vertex invocations and fragment candidates.
export function stageWork(vertices: number, coveredSamples: number, passes: number): Answer<{ vertex: number; fragment: number }> {
  return { vertex: vertices * passes, fragment: coveredSamples * passes };
}

// Draw call anatomy: Estimated draw submissions across the main and shadow passes.
export function estimatedDraws(root: THREE.Object3D, shadowLights: number): Answer<number> {
  let draws = 0; root.traverseVisible((child) => { if (!(child instanceof THREE.Mesh)) return; const pieces = Array.isArray(child.material) && child.geometry.groups.length ? child.geometry.groups.length : 1; draws += pieces; if (child.castShadow) draws += pieces*shadowLights; }); return draws;
}

// State changes and sorting: The overlay renderOrder after setting it.
export function putOverlayLast(overlay: THREE.Object3D, order: number): Answer<number> {
  overlay.renderOrder = order; return overlay.renderOrder;
}

// Depth buffer and early-z: The material configured for opaque depth testing and writing.
export function opaqueOccluder(material: THREE.MeshBasicMaterial): Answer<THREE.MeshBasicMaterial> {
  material.transparent=false; material.depthTest=true; material.depthWrite=true; return material;
}

// Stencil buffer: The material configured to write a stencil reference.
export function stencilWriter(material: THREE.Material, reference: number): Answer<THREE.Material> {
  material.stencilWrite=true; material.stencilRef=reference; material.stencilFunc=THREE.AlwaysStencilFunc; material.stencilZPass=THREE.ReplaceStencilOp; return material;
}

// Blending and transparency: The blended, depth-tested, non-depth-writing material.
export function glassMaterial(material: THREE.MeshBasicMaterial, opacity: number): Answer<THREE.MeshBasicMaterial> {
  material.transparent=true; material.opacity=opacity; material.depthTest=true; material.depthWrite=false; return material;
}

// Render targets: A thumbnail-sized offscreen render target.
export function thumbnailTarget(width: number, height: number): Answer<THREE.WebGLRenderTarget> {
  return new THREE.WebGLRenderTarget(width,height,{depthBuffer:true,stencilBuffer:false});
}

// Multi-pass and post-processing: The full-screen fragment candidates across the passes.
export function postFragments(width: number, height: number, passes: number): Answer<number> {
  return width*height*passes;
}

// Multisampling: The multisampled offscreen target.
export function msaaTarget(width: number, height: number, samples: number): Answer<THREE.WebGLRenderTarget> {
  const target = new THREE.WebGLRenderTarget(width,height); target.samples=samples; return target;
}

// Readback: The Promise for one RGBA picking pixel.
export function readIdPixel(renderer: Pick<THREE.WebGLRenderer, "readRenderTargetPixelsAsync">, target: THREE.WebGLRenderTarget, x: number, y: number): Answer<Promise<ArrayBufferView>> {
  return renderer.readRenderTargetPixelsAsync(target,x,y,1,1,new Uint8Array(4));
}

// Frame budget: Milliseconds available for one frame.
export function budgetForHz(refreshHz: number): Answer<number> {
  return 1000/refreshHz;
}

// Measurement tools: Milliseconds spent in the CPU render call.
export function cpuRenderMs(renderer: Pick<THREE.WebGLRenderer, "render">, scene: THREE.Scene, camera: THREE.Camera, now: () => number): Answer<number> {
  const start = now(); renderer.render(scene,camera); return now()-start;
}
