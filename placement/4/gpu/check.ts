// No docs. Write each small judgment check, then run npm run pick -- done once.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// renderer-tour: Cap renderer pixel ratio before setup.
export function cappedDpr(deviceRatio: number, cap: number): Answer<number> {
  return null;
}

// pipeline-stages: Estimate fragment work from coverage and overdraw.
export function fragmentWork(coveredPixels: number, overdraw: number): Answer<number> {
  return null;
}

// draw-call-anatomy: Estimate draws when every mesh has material groups.
export function drawCallsForGroups(meshes: number, groupsPerMesh: number): Answer<number> {
  return null;
}

// state-sorting: Group opaque meshes by material while preserving transparent draw order.
export function sortMaterials(meshes: THREE.Mesh[]): Answer<THREE.Mesh[]> {
  return null;
}

// depth-early-z: A simple case where depth testing can reject hidden fragments early.
export function earlyDepthLikely(depthTest: boolean, alphaTested: boolean): Answer<boolean> {
  return null;
}

// stencil: Configure a material to write a stencil reference.
export function enableStencilMask(material: THREE.Material, reference: number): Answer<number> {
  return null;
}

// blending: Mark a changed material transparent before its next draw.
export function enableTransparency(material: THREE.Material): Answer<boolean> {
  return null;
}

// render-targets: Allocate an offscreen color target at physical size.
export function offscreenTarget(width: number, height: number): Answer<THREE.WebGLRenderTarget> {
  return null;
}

// multi-pass: Count draws across a base scene and extra passes.
export function totalPassDraws(baseDraws: number, passDraws: number[]): Answer<number> {
  return null;
}

// multisampling: Read an offscreen target's MSAA sample request.
export function samplesUsed(target: THREE.WebGLRenderTarget): Answer<number> {
  return null;
}

// readback: Count bytes moved by an RGBA8 pixel readback.
export function rgbaReadBytes(width: number, height: number): Answer<number> {
  return null;
}

// frame-budget: Judge whether a measured frame exceeds its chosen budget.
export function exceedsBudget(frameMs: number, budgetMs: number): Answer<boolean> {
  return null;
}

// measurement: Read renderer draw-call count from its measurement tools.
export function drawCalls(info: THREE.WebGLInfo): Answer<number> {
  return null;
}
